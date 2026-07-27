"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm, type ProjectOption } from "./ContactForm";
import { GENERAL_ENQUIRY } from "@/lib/schema";

/**
 * Reads `?project=<slug>` and hands the form its starting selection.
 *
 * Separate from ContactForm for two reasons. It keeps the form ignorant of the
 * URL, which is not its concern; and useSearchParams opts a route out of static
 * prerendering unless it sits behind a Suspense boundary, so the component that
 * calls it cannot also be the boundary's fallback.
 *
 * A slug only wins if it names a project that exists. A stale or invented one
 * falls back to the general option rather than selecting nothing.
 */

type PreselectedContactFormProps = {
  readonly projects: readonly ProjectOption[];
};

export function PreselectedContactForm({ projects }: PreselectedContactFormProps) {
  const requested = useSearchParams().get("project");
  const isKnown = requested !== null && projects.some((project) => project.value === requested);

  return (
    <ContactForm projects={projects} preselected={isKnown ? requested : GENERAL_ENQUIRY} />
  );
}
