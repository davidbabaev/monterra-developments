#!/usr/bin/env python3
"""PreToolUse(Bash) guard: typecheck, lint and unit-test before a `git commit`.

Contract: the Claude Code hook payload arrives as JSON on stdin. Anything that
is not a git commit exits 0 immediately so ordinary Bash calls stay fast.

Playwright is deliberately NOT run here — it builds and boots a server, which is
far too slow for a commit hook. Run `npm run test:e2e` yourself.

Exit codes: 0 = allow, 2 = block (stderr is shown to Claude).
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

GIT_COMMIT = re.compile(
    r"\bgit\s+(?:(?:-[cC]\s+\S+|--[a-z][a-z-]*(?:=\S+)?|-[a-zA-Z]+)\s+)*commit\b"
)
COMMIT_ALL = re.compile(r"\bgit\s[^;&|]*\scommit\b[^;&|]*(?:\s-[a-zA-Z]*a|\s--all\b)")

CHECKS = [
    ("typecheck", ["npx", "tsc", "--noEmit"]),
    ("lint", ["npm", "run", "lint", "--silent"]),
    ("unit tests", ["npx", "vitest", "run"]),
]

TAIL_LINES = 40


def project_root() -> Path:
    """.claude/hooks/<this file> -> project root."""
    env_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if env_dir and Path(env_dir).is_dir():
        return Path(env_dir)
    return Path(__file__).resolve().parent.parent.parent


def git(root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=root, capture_output=True, text=True, errors="replace"
    )
    return result.stdout if result.returncode == 0 else ""


def tail(text: str, count: int = TAIL_LINES) -> str:
    lines = [line for line in text.splitlines() if line.strip()]
    return "\n".join(lines[-count:])


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    if payload.get("tool_name") != "Bash":
        return 0

    command = (payload.get("tool_input") or {}).get("command", "")
    if not GIT_COMMIT.search(command):
        return 0

    root = project_root()

    staged = [p for p in git(root, "diff", "--cached", "--name-only").splitlines() if p]
    if COMMIT_ALL.search(command):
        staged += [p for p in git(root, "diff", "--name-only").splitlines() if p]
    if not staged:
        return 0

    env = {**os.environ, "CI": "1", "FORCE_COLOR": "0", "NO_COLOR": "1"}

    for label, argv in CHECKS:
        result = subprocess.run(
            argv,
            cwd=root,
            capture_output=True,
            text=True,
            errors="replace",
            env=env,
        )
        if result.returncode != 0:
            output = tail((result.stdout or "") + "\n" + (result.stderr or ""))
            print(f"BLOCKED: {label} failed ({' '.join(argv)}), exit {result.returncode}.", file=sys.stderr)
            print(f"--- last {TAIL_LINES} lines ---", file=sys.stderr)
            print(output, file=sys.stderr)
            print(f"--- end ---\nFix {label} before committing.", file=sys.stderr)
            return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
