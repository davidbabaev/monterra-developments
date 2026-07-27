import { inquirySchema, type Inquiry } from "./schema";

/**
 * The whole submission path. There is no API route, no backend and no email
 * service — this file is the only thing that knows how an inquiry leaves the
 * page, and it is the only file that changes when a real destination is wired.
 *
 * Nothing else may know how submission works: the form awaits this and reads
 * `ok`, and that contract holds whether the body ends up being a fetch, a form
 * service or a mailto.
 *
 * TODO: connect destination — see docs/build-increments.md "Deferred"
 */

export type InquiryResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: "invalid" | "transport" };

/** Long enough that the submitting state is a real state, not a flicker. */
const LATENCY_MS = 800;

/**
 * A test hook, and a temporary one: a message containing this token makes the
 * stub fail, so the error state can be reached in a browser and in tests
 * without mocking this module or breaking the normal path.
 *
 * It goes when the destination above is wired, along with the delay and the log.
 */
export const FORCE_FAILURE_TOKEN = "[FORCE-ERROR]";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitInquiry(input: Inquiry): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(input);

  // The form validates first, so this is the guard for a caller that did not.
  if (!parsed.success) return { ok: false, reason: "invalid" };

  await wait(LATENCY_MS);

  if (parsed.data.message.includes(FORCE_FAILURE_TOKEN)) {
    return { ok: false, reason: "transport" };
  }

  // Stands in for the request. The payload is logged so the shape being sent is
  // visible while there is nowhere to send it.
  console.info("[inquiry] submitted", parsed.data);

  return { ok: true };
}
