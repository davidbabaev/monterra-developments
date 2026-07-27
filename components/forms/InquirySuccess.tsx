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
      <h2 className="font-display text-[19px] font-semibold text-navy xl:text-[22px]">
        Thanks — we&rsquo;ll be in touch within two business days
      </h2>
      <p className="mt-3 max-w-[52ch] font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]">
        [REPLACE] Your message is with us. If it is urgent, the phone number beside this form
        reaches the office directly.
      </p>
      <div className="mt-6">
        <Button variant="secondary" onClick={onReset}>
          Send another message
        </Button>
      </div>
    </div>
  );
}
