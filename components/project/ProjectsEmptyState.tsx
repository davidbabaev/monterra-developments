import { Button } from "@/components/ui/Button";

/**
 * Shown when a filter matches nothing. It cannot happen with the three seeded
 * projects via the pills, but a stale or hand-edited ?status= can reach it, so
 * it has to exist and has to offer a way back.
 */

type ProjectsEmptyStateProps = {
  readonly onClear: () => void;
};

export function ProjectsEmptyState({ onClear }: ProjectsEmptyStateProps) {
  return (
    <div className="border border-stone p-8 text-center xl:p-12">
      <h2 className="font-display text-[19px] font-semibold text-navy xl:text-[22px]">
        No projects in this stage yet
      </h2>
      <p className="mx-auto mt-3 max-w-[52ch] font-body text-[16px] text-ink">
        [REPLACE] Nothing is at this stage right now. Our completed, current and upcoming
        developments are all listed together.
      </p>
      <div className="mt-6 flex justify-center">
        <Button variant="primary" onClick={onClear}>
          View all projects
        </Button>
      </div>
    </div>
  );
}
