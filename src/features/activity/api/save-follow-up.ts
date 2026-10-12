import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { ActivityType, LeadActivity } from "@/types/api";

export type SaveFollowUpInput = {
  leadId: string;
  type: ActivityType;
  note: string;
};

export const saveFollowUp = async ({
  leadId,
  type,
  note,
}: SaveFollowUpInput) => {
  return api.post<LeadActivity, { type: ActivityType; note: string }>(
    `/leads/${leadId}/activities`,
    { type, note },
  );
};

type UseSaveFollowUpOptions = {
  mutationConfig?: MutationConfig<typeof saveFollowUp>;
};

export const useSaveFollowUp = ({
  mutationConfig,
}: UseSaveFollowUpOptions = {}) =>
  useMutation({
    mutationFn: saveFollowUp,
    ...mutationConfig,
  });
