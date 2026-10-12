import { describe, expect, it } from "vitest";

import { leads } from "@/features/leads/data";
import { validateFollowUpInput } from "@/features/activity/validation";

const leadId = leads[0].id;

describe("follow-up validation", () => {
  it("normalizes valid input for saving", () => {
    expect(
      validateFollowUpInput({
        leadId,
        type: "email",
        note: "  Confirmed a Saturday test drive.  ",
      }),
    ).toEqual({
      ok: true,
      value: {
        leadId,
        type: "email",
        note: "Confirmed a Saturday test drive.",
      },
    });
  });

  it("returns shared messages and statuses for invalid input", () => {
    expect(
      validateFollowUpInput({ leadId: "missing", type: "email", note: "Hi" }),
    ).toEqual({
      ok: false,
      error: {
        message: "Choose a known lead before recording a follow-up.",
        status: 404,
      },
    });

    expect(validateFollowUpInput({ leadId, type: "fax", note: "Hi" })).toEqual({
      ok: false,
      error: {
        message: "Choose a valid activity type before saving.",
        status: 400,
      },
    });

    expect(validateFollowUpInput({ leadId, type: "call", note: "  " })).toEqual(
      {
        ok: false,
        error: {
          message: "Enter a follow-up note before saving.",
          status: 400,
        },
      },
    );
  });
});
