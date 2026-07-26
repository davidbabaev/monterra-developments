"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectsEmptyState } from "./ProjectsEmptyState";
import {
  ALL_FILTER,
  FILTER_VALUES,
  StatusFilter,
  isProjectStatus,
  type StatusFilterValue,
} from "./StatusFilter";
import type { ProjectCardData } from "./projectCardData";

/**
 * Owns the filter state. The whole list is already on the page, so filtering is
 * a synchronous array filter — no loading state, no refetch, no navigation.
 *
 * The selection is read from and written to `?status=`, which is what makes a
 * filtered view linkable and lets the footer deep-link straight into one.
 */

type ProjectsBrowserProps = {
  readonly projects: readonly ProjectCardData[];
};

/**
 * An unrecognised `?status=` is treated as a filter that matches nothing rather
 * than being silently ignored. A stale or hand-edited link then lands on the
 * empty state, which explains itself and offers a way back, instead of quietly
 * showing everything and looking like the link worked.
 */
function readSelection(raw: string | null): string {
  if (raw === null || raw === "") return ALL_FILTER;
  return raw;
}

export function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * The URL seeds the selection; after that React state owns it.
   *
   * `router.replace` is not used here. Replacing the same pathname with no
   * query is a no-op in the App Router, so clearing the filter left a stale
   * `?status=` in the address bar. The History API always applies, and Next
   * supports it for exactly this — a shallow URL update with no navigation,
   * which is what "instant client-side filtering" requires.
   */
  const [selection, setSelection] = useState(() => readSelection(searchParams.get("status")));

  const counts = useMemo(() => {
    const tally = Object.fromEntries(FILTER_VALUES.map((value) => [value, 0])) as Record<
      StatusFilterValue,
      number
    >;
    tally[ALL_FILTER] = projects.length;
    for (const project of projects) tally[project.status] += 1;
    return tally;
  }, [projects]);

  const visible = useMemo(() => {
    if (selection === ALL_FILTER) return projects;
    if (!isProjectStatus(selection)) return [];
    return projects.filter((project) => project.status === selection);
  }, [projects, selection]);

  const select = (value: StatusFilterValue) => {
    setSelection(value);

    const params = new URLSearchParams(window.location.search);
    if (value === ALL_FILTER) params.delete("status");
    else params.set("status", value);

    const query = params.toString();
    window.history.replaceState(null, "", query === "" ? pathname : `${pathname}?${query}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <StatusFilter selected={selection} counts={counts} onSelect={select} />

      {visible.length === 0 ? (
        <ProjectsEmptyState onClear={() => select(ALL_FILTER)} />
      ) : (
        <ProjectGrid projects={visible} />
      )}
    </div>
  );
}
