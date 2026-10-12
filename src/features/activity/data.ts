import { leads } from "@/features/leads/data";
import type { ActivitySort, ActivityType, LeadActivity } from "@/types/api";

const activityFixtures: Omit<LeadActivity, "type">[] = [
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
    id: "activity-anna-0",
    leadId: "lead-anna-reed",
    note: "Reviewed the website inquiry and assigned it for follow-up.",
    createdAt: "2026-01-12T09:45:00.000Z",
  },
  {
    id: "activity-anna-minus-1",
    leadId: "lead-anna-reed",
    note: "Sent a confirmation that the inquiry was received.",
    createdAt: "2026-01-12T09:30:00.000Z",
  },
  {
    id: "activity-anna-minus-2",
    leadId: "lead-anna-reed",
    note: "Checked vehicle availability before contacting the customer.",
    createdAt: "2026-01-12T09:20:00.000Z",
  },
  {
    id: "activity-anna-minus-3",
    leadId: "lead-anna-reed",
    note: "Created the initial follow-up record from the website inquiry.",
    createdAt: "2026-01-12T09:19:00.000Z",
  },
  {
    id: "activity-marcus-2",
    leadId: "lead-marcus-chen",
    note: "Emailed a short list of SUV options matching the requested budget.",
    createdAt: "2026-01-13T16:20:00.000Z",
  },
  {
    id: "activity-marcus-1",
    leadId: "lead-marcus-chen",
    note: "Reviewed the requested budget and shortlisted suitable used SUVs.",
    createdAt: "2026-01-13T15:10:00.000Z",
  },
  {
    id: "activity-priya-2",
    leadId: "lead-priya-shah",
    note: "Sent part-exchange guidance and requested the current vehicle registration.",
    createdAt: "2026-01-14T13:40:00.000Z",
  },
  {
    id: "activity-priya-1",
    leadId: "lead-priya-shah",
    note: "Acknowledged the part-exchange inquiry and outlined the next steps.",
    createdAt: "2026-01-14T11:30:00.000Z",
  },
  {
    id: "activity-oliver-2",
    leadId: "lead-oliver-bennett",
    note: "Confirmed the compact hybrid remains available and shared delivery details.",
    createdAt: "2026-01-15T10:15:00.000Z",
  },
  {
    id: "activity-oliver-1",
    leadId: "lead-oliver-bennett",
    note: "Checked availability with the sales team after the website inquiry arrived.",
    createdAt: "2026-01-15T09:05:00.000Z",
  },
  {
    id: "activity-sofia-2",
    leadId: "lead-sofia-martinez",
    note: "Proposed video appointment times and sent finance information.",
    createdAt: "2026-01-16T14:00:00.000Z",
  },
  {
    id: "activity-sofia-1",
    leadId: "lead-sofia-martinez",
    note: "Reviewed the appointment request and prepared finance options.",
    createdAt: "2026-01-16T11:00:00.000Z",
  },
  {
    id: "activity-noah-2",
    leadId: "lead-noah-wilson",
    note: "Shared a preliminary trade-in estimate and invited further vehicle details.",
    createdAt: "2026-01-17T15:25:00.000Z",
  },
  {
    id: "activity-noah-1",
    leadId: "lead-noah-wilson",
    note: "Reviewed the trade-in request and noted the vehicle information needed.",
    createdAt: "2026-01-17T13:15:00.000Z",
  },
  {
    id: "activity-emily-2",
    leadId: "lead-emily-carter",
    note: "Confirmed ISOFIX availability and sent details for the seven-seat SUV.",
    createdAt: "2026-01-18T17:05:00.000Z",
  },
  {
    id: "activity-emily-1",
    leadId: "lead-emily-carter",
    note: "Checked the vehicle specification against the ISOFIX requirement.",
    createdAt: "2026-01-18T15:40:00.000Z",
  },
  {
    id: "activity-james-2",
    leadId: "lead-james-patel",
    note: "Arranged a call to discuss warranty cover and care plan options.",
    createdAt: "2026-01-19T12:10:00.000Z",
  },
  {
    id: "activity-james-1",
    leadId: "lead-james-patel",
    note: "Reviewed the approved used coupe inquiry and warranty questions.",
    createdAt: "2026-01-19T10:20:00.000Z",
  },
  {
    id: "activity-amelia-2",
    leadId: "lead-amelia-brooks",
    note: "Confirmed the requested test-drive appointment change.",
    createdAt: "2026-01-20T17:20:00.000Z",
  },
  {
    id: "activity-amelia-1",
    leadId: "lead-amelia-brooks",
    note: "Contacted the showroom to check available times next Tuesday.",
    createdAt: "2026-01-20T16:35:00.000Z",
  },
  {
    id: "activity-ethan-2",
    leadId: "lead-ethan-morgan",
    note: "Sent incoming-stock options matching the automatic city-car request.",
    createdAt: "2026-01-21T14:30:00.000Z",
  },
  {
    id: "activity-ethan-1",
    leadId: "lead-ethan-morgan",
    note: "Reviewed upcoming stock for automatic city cars with parking sensors.",
    createdAt: "2026-01-21T12:15:00.000Z",
  },
  {
    id: "activity-isla-2",
    leadId: "lead-isla-thompson",
    note: "Shared monthly-payment examples for petrol and electric versions.",
    createdAt: "2026-01-22T16:00:00.000Z",
  },
  {
    id: "activity-isla-1",
    leadId: "lead-isla-thompson",
    note: "Prepared a payment comparison using the models the customer selected.",
    createdAt: "2026-01-22T13:50:00.000Z",
  },
  {
    id: "activity-lucas-2",
    leadId: "lead-lucas-hughes",
    note: "Confirmed the inquiry is closed and left the door open for future help.",
    createdAt: "2026-01-23T18:15:00.000Z",
  },
  {
    id: "activity-lucas-1",
    leadId: "lead-lucas-hughes",
    note: "Acknowledged that another vehicle was chosen and reviewed the closure request.",
    createdAt: "2026-01-23T17:55:00.000Z",
  },
];

const leadIdByFixtureId: Record<string, string> = {
  "lead-anna-reed": "3cecaaa6-8871-4ada-89ce-9f5c5cbcbc97",
  "lead-marcus-chen": "6607f6bb-ec2d-4740-9017-2e5a21030e84",
  "lead-priya-shah": "66ac0b25-630e-4717-8b07-a86d12ba5f1c",
  "lead-oliver-bennett": "6d364032-d5c0-484c-9e61-fe2ab670fcb7",
  "lead-sofia-martinez": "e51abd43-a1d1-4fc0-92ac-23a782db206f",
  "lead-noah-wilson": "7e7d1aa9-4f2b-42bd-9031-fdb423c50cb3",
  "lead-emily-carter": "11e54dde-9d01-4b7a-a8e3-6542b28435a2",
  "lead-james-patel": "8dd1bedc-c245-407c-952a-676d0a1fa307",
  "lead-amelia-brooks": "c8f6eb7c-519c-43ce-b4aa-908a3cf8f0af",
  "lead-ethan-morgan": "7ab4f27d-0983-4b34-abae-327dbcee4166",
  "lead-isla-thompson": "71ba0d53-3106-4a42-9eff-0fa38f0c06e9",
  "lead-lucas-hughes": "d0b9f11d-0fc0-48c2-bbc4-1cbcf23b58a4",
};

const fixtureActivityTypes: ActivityType[] = ["call", "email", "message"];

const mappedFixtureActivities: LeadActivity[] = activityFixtures.map(
  (activity, index) => ({
    ...activity,
    leadId: leadIdByFixtureId[activity.leadId],
    type: fixtureActivityTypes[index % fixtureActivityTypes.length],
  }),
);

const leadIdsWithFixtureActivities = new Set(
  mappedFixtureActivities.map((activity) => activity.leadId),
);

const generatedFixtureActivities: LeadActivity[] = leads
  .filter((lead) => !leadIdsWithFixtureActivities.has(lead.id))
  .map((lead, index) => ({
    id: `activity-${lead.id}-initial`,
    leadId: lead.id,
    type: fixtureActivityTypes[index % fixtureActivityTypes.length],
    note: "Reviewed the website inquiry and queued the lead for follow-up.",
    createdAt: new Date(
      Date.parse(lead.createdAt) + 30 * 60 * 1000,
    ).toISOString(),
  }));

export const fixtureActivities: LeadActivity[] = [
  ...mappedFixtureActivities,
  ...generatedFixtureActivities,
];

export const sortActivities = (
  activities: LeadActivity[],
  sort: ActivitySort = "newest",
): LeadActivity[] => {
  return activities.toSorted((left, right) => {
    const newestFirst =
      Date.parse(right.createdAt) - Date.parse(left.createdAt) ||
      right.id.localeCompare(left.id);

    return sort === "newest" ? newestFirst : -newestFirst;
  });
};

export const getActivitiesForLead = (
  leadId: string,
  sort: ActivitySort = "newest",
): LeadActivity[] => {
  return sortActivities(
    fixtureActivities.filter((activity) => activity.leadId === leadId),
    sort,
  );
};
