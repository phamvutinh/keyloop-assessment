import type { LeadActivity } from "@/types/api";

export const fixtureActivities: LeadActivity[] = [
  {
    id: "activity-anna-2",
    leadId: "lead-anna-reed",
    note: "Confirmed preferred test drive time and sent showroom address.",
    createdAt: "2026-01-12T13:30:00.000Z",
  },
  {
    id: "activity-anna-1",
    leadId: "lead-anna-reed",
    note: "Left voicemail after website inquiry arrived.",
    createdAt: "2026-01-12T10:05:00.000Z",
  },
  {
    id: "activity-marcus-1",
    leadId: "lead-marcus-chen",
    note: "Emailed a short list of SUV options matching the requested budget.",
    createdAt: "2026-01-13T16:20:00.000Z",
  },
];

export const getActivitiesForLead = (leadId: string): LeadActivity[] => {
  return fixtureActivities
    .filter((activity) => activity.leadId === leadId)
    .toSorted(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );
};
