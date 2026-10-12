import { getLead } from "@/features/leads/data";
import { activityTypes, type ActivityType } from "@/types/api";

export type ValidatedFollowUpInput = {
  leadId: string;
  type: ActivityType;
  note: string;
};

type FollowUpValidationError = {
  message: string;
  status: 400 | 404;
};

export type FollowUpValidationResult =
  | { ok: true; value: ValidatedFollowUpInput }
  | { ok: false; error: FollowUpValidationError };

export const isActivityType = (value: unknown): value is ActivityType =>
  typeof value === "string" && activityTypes.includes(value as ActivityType);

export const validateFollowUpInput = ({
  leadId,
  type,
  note,
}: {
  leadId: string;
  type: unknown;
  note: unknown;
}): FollowUpValidationResult => {
  if (!getLead(leadId)) {
    return {
      ok: false,
      error: {
        message: "Choose a known lead before recording a follow-up.",
        status: 404,
      },
    };
  }

  if (!isActivityType(type)) {
    return {
      ok: false,
      error: {
        message: "Choose a valid activity type before saving.",
        status: 400,
      },
    };
  }

  if (typeof note !== "string") {
    return {
      ok: false,
      error: {
        message: "Enter a follow-up note before saving.",
        status: 400,
      },
    };
  }

  const trimmedNote = note.trim();

  if (!trimmedNote) {
    return {
      ok: false,
      error: {
        message: "Enter a follow-up note before saving.",
        status: 400,
      },
    };
  }

  return {
    ok: true,
    value: {
      leadId,
      type,
      note: trimmedNote,
    },
  };
};
