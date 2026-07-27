import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/**
 * jsdom implements no media queries at all, so any component that asks about
 * motion preference throws rather than answering.
 *
 * The stub answers `true` to prefers-reduced-motion and `false` to everything
 * else, which is the honest reading of this environment: there is no layout, no
 * paint and no scrolling here, so nothing should animate. Components take their
 * static path, which is the one a unit test can assert. Motion itself is
 * verified in Playwright, against a browser that has a real preference to
 * emulate.
 */
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: query.includes("prefers-reduced-motion"),
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

afterEach(() => {
  cleanup();
});
