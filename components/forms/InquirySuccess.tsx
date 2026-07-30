import { Button } from "@/components/ui/Button";

/**
 * What replaces the form once an inquiry is away.
 *
 * A stone-bordered panel rather than a stone slab: the text stays on the page
 * background, where slate and ivory are both legal, and the edge does the work.
 * It is a live region, so a reader who submitted by keyboard is told it worked
 * without having to go looking.
 */

type InquirySuccessProps = {
  readonly onReset: () => void;
};

export function InquirySuccess({ onReset }: InquirySuccessProps) {
  return (
    <div role="status" className="border border-stone p-6 xl:p-8">
      {/*
        Approved copy, and the whole of it. The second paragraph that used to sit
        here was placeholder and none was written to replace it: the confirmation
        says the one thing a reader needs, so another line would be padding.
      */}
      <h2 className="font-display text-[19px] font-semibold text-navy xl:text-[22px]">
        Thanks — we will be in touch within two business days.
      </h2>
      <div className="mt-6">
        <Button variant="secondary" onClick={onReset}>
          Send another message
        </Button>
      </div>
    </div>
  );
}
