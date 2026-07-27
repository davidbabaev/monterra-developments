import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/forms/ContactForm";
import { GENERAL_ENQUIRY, inquirySchema } from "@/lib/schema";
import { FORCE_FAILURE_TOKEN, submitInquiry } from "@/lib/submitInquiry";

/**
 * The four states, and the two things that are easy to get wrong about them:
 * that every field is announced with its own message, and that a failure never
 * costs the reader what they typed.
 */

const PROJECTS = [
  { value: "monterra-ridge", label: "Monterra Ridge" },
  { value: "the-larkin", label: "The Larkin" },
];

const nameField = () => screen.getByLabelText(/full name/i);
const emailField = () => screen.getByLabelText(/^email/i);
const messageField = () => screen.getByLabelText(/message/i);
const submit = () => screen.getByRole("button", { name: /send message|sending/i });

async function fillValid(user: ReturnType<typeof userEvent.setup>, message = "A real message.") {
  await user.type(nameField(), "Dana Okafor");
  await user.type(emailField(), "dana@example.com");
  await user.type(messageField(), message);
}

beforeEach(() => {
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("inquirySchema", () => {
  it("rejects a malformed email and a message with nothing in it", () => {
    const result = inquirySchema.safeParse({
      name: "Dana",
      email: "not-an-email",
      project: GENERAL_ENQUIRY,
      message: "",
    });

    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toContain("email");
    expect(fields).toContain("message");
  });

  it("accepts an inquiry with no phone number, which is optional", () => {
    const result = inquirySchema.safeParse({
      name: "Dana Okafor",
      email: "dana@example.com",
      phone: "",
      project: GENERAL_ENQUIRY,
      message: "We are looking for a three bedroom.",
    });

    expect(result.success).toBe(true);
  });
});

describe("submitInquiry", () => {
  it("resolves ok for a valid inquiry", async () => {
    const result = await submitInquiry({
      name: "Dana Okafor",
      email: "dana@example.com",
      project: GENERAL_ENQUIRY,
      message: "We are looking for a three bedroom.",
    });

    expect(result).toEqual({ ok: true });
  });

  it("refuses an invalid payload rather than sending it", async () => {
    const result = await submitInquiry({
      name: "",
      email: "nope",
      project: GENERAL_ENQUIRY,
      message: "",
    });

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("fails on the documented token, which is how the error state is reached", async () => {
    const result = await submitInquiry({
      name: "Dana Okafor",
      email: "dana@example.com",
      project: GENERAL_ENQUIRY,
      message: `Please break this ${FORCE_FAILURE_TOKEN}`,
    });

    expect(result).toEqual({ ok: false, reason: "transport" });
  });
});

describe("ContactForm fields", () => {
  it("gives every control a real label, never a placeholder", () => {
    render(<ContactForm projects={PROJECTS} />);

    for (const field of [
      nameField(),
      emailField(),
      messageField(),
      screen.getByLabelText(/phone/i),
      screen.getByLabelText(/project of interest/i),
    ]) {
      expect(field).toBeInTheDocument();
      expect(field).not.toHaveAttribute("placeholder");
    }
  });

  it("marks required fields in words as well as programmatically", () => {
    render(<ContactForm projects={PROJECTS} />);

    expect(nameField()).toBeRequired();
    expect(screen.getByLabelText(/full name.*required/i)).toBe(nameField());
    expect(screen.getByLabelText(/phone.*optional/i)).toBeInTheDocument();
  });

  it("builds its options from the projects it is given, plus a general enquiry", () => {
    render(<ContactForm projects={PROJECTS} />);
    const options = within(screen.getByLabelText(/project of interest/i)).getAllByRole("option");

    expect(options.map((option) => option.textContent)).toEqual([
      "General enquiry",
      "Monterra Ridge",
      "The Larkin",
    ]);
  });

  it("starts on the general option, and on a named project when told to", () => {
    const { unmount } = render(<ContactForm projects={PROJECTS} />);
    expect(screen.getByLabelText(/project of interest/i)).toHaveValue(GENERAL_ENQUIRY);
    unmount();

    render(<ContactForm projects={PROJECTS} preselected="monterra-ridge" />);
    expect(screen.getByLabelText(/project of interest/i)).toHaveValue("monterra-ridge");
  });
});

describe("ContactForm validation", () => {
  it("describes each empty required field with its own message", async () => {
    const user = userEvent.setup();
    render(<ContactForm projects={PROJECTS} />);

    await user.click(submit());

    await waitFor(() => expect(nameField()).toHaveAccessibleDescription(/enter your full name/i));
    expect(emailField()).toHaveAccessibleDescription(/email address/i);
    expect(messageField()).toHaveAccessibleDescription(/at least a sentence/i);

    for (const field of [nameField(), emailField(), messageField()]) {
      expect(field).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("describes nothing while a field is still valid", () => {
    render(<ContactForm projects={PROJECTS} />);

    expect(nameField()).not.toHaveAttribute("aria-invalid");
    expect(nameField()).toHaveAccessibleDescription("");
  });

  it("does not submit an invalid form", async () => {
    const user = userEvent.setup();
    const logged = vi.spyOn(console, "info");
    render(<ContactForm projects={PROJECTS} />);

    await user.click(submit());
    await waitFor(() => expect(nameField()).toHaveAttribute("aria-invalid", "true"));

    expect(logged).not.toHaveBeenCalled();
  });
});

describe("ContactForm states", () => {
  it("locks every field while sending and says so in words", async () => {
    const user = userEvent.setup();
    render(<ContactForm projects={PROJECTS} />);
    await fillValid(user);

    await user.click(submit());

    await waitFor(() => expect(screen.getByText("Sending…")).toBeInTheDocument());
    expect(nameField()).toBeDisabled();
    expect(messageField()).toBeDisabled();
    expect(submit()).toBeDisabled();
    // Announced, not just relabelled: the label change alone is silent.
    expect(screen.getByText("Sending your message")).toBeInTheDocument();
  });

  it("replaces the form with a panel on success, and comes back on request", async () => {
    const user = userEvent.setup();
    render(<ContactForm projects={PROJECTS} />);
    await fillValid(user);
    await user.click(submit());

    const heading = await screen.findByText(/two business days/i, {}, { timeout: 3000 });
    // The panel is a live region, so a keyboard submitter is told it worked.
    expect(heading.closest("[role='status']")).not.toBeNull();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /send another message/i }));

    expect(nameField()).toBeInTheDocument();
    expect(nameField()).toHaveValue("");
  });

  it("keeps every entered value when the submission fails", async () => {
    const user = userEvent.setup();
    render(<ContactForm projects={PROJECTS} preselected="the-larkin" />);

    const message = `We would like a viewing. ${FORCE_FAILURE_TOKEN}`;
    await user.type(nameField(), "Dana Okafor");
    await user.type(emailField(), "dana@example.com");
    await user.type(screen.getByLabelText(/phone/i), "512 555 0142");
    // Pasted rather than typed: userEvent reads square brackets in a typed
    // string as key descriptors, and the token is full of them.
    await user.click(messageField());
    await user.paste(message);

    await user.click(submit());

    const banner = await screen.findByRole("alert", {}, { timeout: 3000 });
    expect(banner).toHaveTextContent(/something went wrong/i);
    expect(within(banner).getByRole("link")).toHaveAttribute("href", expect.stringMatching(/^mailto:/));

    // The form is still there, and so is everything typed into it.
    expect(nameField()).toHaveValue("Dana Okafor");
    expect(emailField()).toHaveValue("dana@example.com");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("512 555 0142");
    expect(messageField()).toHaveValue(message);
    expect(screen.getByLabelText(/project of interest/i)).toHaveValue("the-larkin");
  });
});
