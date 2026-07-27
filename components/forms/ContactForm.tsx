"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { GENERAL_ENQUIRY, inquirySchema, type Inquiry } from "@/lib/schema";
import { submitInquiry } from "@/lib/submitInquiry";
import { FormField } from "./FormField";
import { InquirySuccess } from "./InquirySuccess";
import { SubmissionError } from "./SubmissionError";

/**
 * Four states, all reachable: idle, submitting, success, error.
 *
 * The form knows nothing about how an inquiry is sent. It awaits
 * lib/submitInquiry.ts and reads `ok`, which is the whole contract, so wiring a
 * real destination later touches that file and not this one.
 *
 * On failure the form is left exactly as it was. Every value the reader typed
 * survives, because asking someone to retype a message they already wrote is a
 * worse outcome than the failure that caused it.
 */

export type ProjectOption = {
  readonly value: string;
  readonly label: string;
};

type ContactFormProps = {
  /** Derived from the content on disk, never hardcoded. */
  readonly projects: readonly ProjectOption[];
  /**
   * Which option starts selected. Reading that off the URL belongs to
   * PreselectedContactForm — the form itself has no business knowing that a
   * query string exists, and keeping it out is what lets this render inside a
   * Suspense fallback.
   */
  readonly preselected?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ projects, preselected = GENERAL_ENQUIRY }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  const options = [{ value: GENERAL_ENQUIRY, label: "General enquiry" }, ...projects];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", project: preselected, message: "" },
  });

  const onSubmit = async (values: Inquiry) => {
    setStatus("submitting");
    const result = await submitInquiry(values);
    setStatus(result.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <InquirySuccess
        onReset={() => {
          reset();
          setStatus("idle");
        }}
      />
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <div>
      {status === "error" && <SubmissionError />}

      <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
        {/* One disabled attribute locks every control inside, including the
            submit button, without a disabled prop on each one. */}
        <fieldset disabled={isSubmitting} className="flex flex-col gap-6">
          <legend className="sr-only">Your inquiry</legend>

          <FormField id="name" label="Full name" required error={errors.name?.message}>
            {(control) => <Input {...control} {...register("name")} autoComplete="name" />}
          </FormField>

          <FormField id="email" label="Email" required error={errors.email?.message}>
            {(control) => (
              <Input {...control} {...register("email")} type="email" autoComplete="email" />
            )}
          </FormField>

          <FormField id="phone" label="Phone" error={errors.phone?.message}>
            {(control) => (
              <Input {...control} {...register("phone")} type="tel" autoComplete="tel" />
            )}
          </FormField>

          <FormField id="project" label="Project of interest" error={errors.project?.message}>
            {(control) => <Select {...control} {...register("project")} options={options} />}
          </FormField>

          <FormField id="message" label="Message" required error={errors.message?.message}>
            {(control) => <Textarea {...control} {...register("message")} />}
          </FormField>

          <div className="flex items-center gap-4">
            <Button type="submit" variant="primary">
              {isSubmitting ? (
                <>
                  <Spinner />
                  Sending…
                </>
              ) : (
                "Send message"
              )}
            </Button>
            {/* The label change alone is silent to a screen reader. */}
            <span role="status" className="sr-only">
              {isSubmitting ? "Sending your message" : ""}
            </span>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
