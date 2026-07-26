#!/usr/bin/env python3
"""PreToolUse(Bash) guard: refuse to let a `git commit` carry secrets.

Contract: the Claude Code hook payload arrives as JSON on stdin. Anything that
is not a git commit exits 0 immediately so ordinary Bash calls stay fast.

Exit codes: 0 = allow, 2 = block (stderr is shown to Claude).
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

# --- what counts as a commit ------------------------------------------------

# Tolerates global options between `git` and `commit`:
#   git commit / git -C dir commit / git -c user.name=x commit / git --no-pager commit
GIT_COMMIT = re.compile(
    r"\bgit\s+(?:(?:-[cC]\s+\S+|--[a-z][a-z-]*(?:=\S+)?|-[a-zA-Z]+)\s+)*commit\b"
)
COMMIT_ALL = re.compile(r"\bgit\s[^;&|]*\scommit\b[^;&|]*(?:\s-[a-zA-Z]*a|\s--all\b)")

# --- what counts as a secret ------------------------------------------------

SECRET_PATTERNS = [
    ("AWS access key id", re.compile(r"\b(?:AKIA|ASIA|ABIA|ACCA|AGPA|AIDA|AIPA|ANPA|AROA)[0-9A-Z]{16}\b")),
    ("AWS secret access key", re.compile(r"(?i)aws_?secret_?access_?key\s*[:=]\s*['\"]?[A-Za-z0-9/+=]{40}")),
    ("PEM private key", re.compile(r"-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----")),
    ("MongoDB URI with credentials", re.compile(r"mongodb(?:\+srv)?://[^\s:@/]+:[^\s:@/]+@")),
    ("Postgres URI with credentials", re.compile(r"postgres(?:ql)?://[^\s:@/]+:[^\s:@/]+@")),
    ("JSON Web Token", re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}")),
    ("GitHub token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b")),
    ("GitHub fine-grained token", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b")),
    ("Anthropic API key", re.compile(r"\bsk-ant-[A-Za-z0-9_-]{16,}\b")),
    (
        "credential assignment (16+ chars)",
        re.compile(
            r"(?i)\b[\w.-]*(?:api[_-]?key|secret|token|password|passwd|pwd)[\w.-]*\s*[:=]\s*"
            r"['\"]?[A-Za-z0-9_\-./+=]{16,}"
        ),
    ),
]

# Lines that reference a secret rather than containing one.
IGNORE_SUBSTRINGS = (
    "process.env.",
    "import.meta.env.",
    "${",
    "[REPLACE",
    "changeme",
    "change-me",
    "your-",
    "your_",
    "<your",
    "placeholder",
    "redacted",
    "xxxxx",
    "example.com",
    "****",
    "todo",
    "fixme",
)

# Real env files are blocked; shareable stubs are not.
ENV_STUB_SUFFIXES = (".example", ".template", ".sample")


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


def is_env_file(path: str) -> bool:
    name = Path(path).name
    if not name.startswith(".env"):
        return False
    return not name.endswith(ENV_STUB_SUFFIXES)


def should_ignore(line: str) -> bool:
    lowered = line.lower()
    return any(token.lower() in lowered for token in IGNORE_SUBSTRINGS)


def scan_diff(diff: str) -> list[tuple[str, str, str]]:
    """Return (file, pattern name, offending line) for every added line that matches."""
    findings: list[tuple[str, str, str]] = []
    current = "(unknown file)"
    for raw in diff.splitlines():
        if raw.startswith("+++ "):
            target = raw[4:].strip()
            current = target[2:] if target.startswith("b/") else target
            continue
        if not raw.startswith("+") or raw.startswith("+++"):
            continue
        line = raw[1:]
        if should_ignore(line):
            continue
        for name, pattern in SECRET_PATTERNS:
            if pattern.search(line):
                findings.append((current, name, line.strip()[:160]))
                break
    return findings


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

    staged = [p for p in git(root, "diff", "--cached", "--name-only", "--diff-filter=ACMR").splitlines() if p]
    diff = git(root, "diff", "--cached", "--unified=0")

    # `git commit -a` stages tracked edits at commit time, so scan those too.
    if COMMIT_ALL.search(command):
        staged += [p for p in git(root, "diff", "--name-only", "--diff-filter=ACMR").splitlines() if p]
        diff += git(root, "diff", "--unified=0")

    if not staged:
        return 0

    problems: list[str] = []

    for path in sorted(set(staged)):
        if is_env_file(path):
            problems.append(f"  {path}: real .env file staged (only .env.example/.template/.sample are allowed)")

    for path, name, line in scan_diff(diff):
        problems.append(f"  {path}: {name} -> {line}")

    if problems:
        print("BLOCKED: possible secrets in this commit.", file=sys.stderr)
        print("\n".join(problems), file=sys.stderr)
        print(
            "\nUnstage or scrub the values above, then commit again. "
            "Reference secrets via process.env.* instead of literals.",
            file=sys.stderr,
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
