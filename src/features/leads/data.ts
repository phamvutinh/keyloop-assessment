import type { Lead } from "@/types/api";

export const leads: Lead[] = [
  {
    id: "3cecaaa6-8871-4ada-89ce-9f5c5cbcbc97",
    name: "Anna Reed",
    email: "anna.reed@example.com",
    phone: "+44 20 7946 0123",
    message:
      "I saw the new electric hatchback online and would like to arrange a test drive this weekend.",
    createdAt: "2026-01-12T09:18:00.000Z",
  },
  {
    id: "6607f6bb-ec2d-4740-9017-2e5a21030e84",
    name: "Marcus Chen",
    email: null,
    phone: "+44 161 555 0188",
    message:
      "Please send pricing for a used family SUV with low mileage. I am comparing options before visiting.",
    createdAt: "2026-01-13T14:42:00.000Z",
  },
  {
    id: "66ac0b25-630e-4717-8b07-a86d12ba5f1c",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    phone: null,
    message:
      "I submitted an inquiry about part-exchanging my current vehicle and would like to know next steps.",
    createdAt: "2026-01-14T11:05:00.000Z",
  },
  {
    id: "6d364032-d5c0-484c-9e61-fe2ab670fcb7",
    name: "Oliver Bennett",
    email: "oliver.bennett@example.com",
    phone: "+44 113 555 0144",
    message:
      "Could you confirm whether the compact hybrid advertised with delivery mileage is still available?",
    createdAt: "2026-01-15T08:36:00.000Z",
  },
  {
    id: "e51abd43-a1d1-4fc0-92ac-23a782db206f",
    name: "Sofia Martinez",
    email: "sofia.martinez@example.com",
    phone: "+44 121 555 0197",
    message:
      "I would like to book a video appointment to discuss finance options for the nearly new saloon.",
    createdAt: "2026-01-16T10:24:00.000Z",
  },
  {
    id: "7e7d1aa9-4f2b-42bd-9031-fdb423c50cb3",
    name: "Noah Wilson",
    email: null,
    phone: "+44 141 555 0163",
    message:
      "Please let me know the trade-in estimate for my 2019 hatchback against the estate car on your site.",
    createdAt: "2026-01-17T12:50:00.000Z",
  },
  {
    id: "11e54dde-9d01-4b7a-a8e3-6542b28435a2",
    name: "Emily Carter",
    email: "emily.carter@example.com",
    phone: null,
    message:
      "I am interested in the seven-seat SUV and need confirmation that it has ISOFIX points in the rear row.",
    createdAt: "2026-01-18T15:12:00.000Z",
  },
  {
    id: "8dd1bedc-c245-407c-952a-676d0a1fa307",
    name: "James Patel",
    email: "james.patel@example.com",
    phone: "+44 151 555 0138",
    message:
      "Can someone call me about warranty cover and care plan pricing for the approved used coupe?",
    createdAt: "2026-01-19T09:45:00.000Z",
  },
  {
    id: "c8f6eb7c-519c-43ce-b4aa-908a3cf8f0af",
    name: "Amelia Brooks",
    email: "amelia.brooks@example.com",
    phone: "+44 191 555 0127",
    message:
      "I completed the online form for a test drive but need to move the appointment to next Tuesday afternoon.",
    createdAt: "2026-01-20T16:08:00.000Z",
  },
  {
    id: "7ab4f27d-0983-4b34-abae-327dbcee4166",
    name: "Ethan Morgan",
    email: null,
    phone: "+44 29 5555 0182",
    message:
      "Do you have any automatic city cars arriving this month in blue or silver with parking sensors?",
    createdAt: "2026-01-21T11:32:00.000Z",
  },
  {
    id: "71ba0d53-3106-4a42-9eff-0fa38f0c06e9",
    name: "Isla Thompson",
    email: "isla.thompson@example.com",
    phone: "+44 131 555 0159",
    message:
      "I want to compare monthly payments for petrol and electric versions before deciding which model to view.",
    createdAt: "2026-01-22T13:18:00.000Z",
  },
  {
    id: "d0b9f11d-0fc0-48c2-bbc4-1cbcf23b58a4",
    name: "Lucas Hughes",
    email: "lucas.hughes@example.com",
    phone: null,
    message:
      "Thanks for the valuation. I have chosen another vehicle, so please close my inquiry for now.",
    createdAt: "2026-01-23T17:41:00.000Z",
  },
];

export const sortLeadsByNewest = (leadList: Lead[]): Lead[] => {
  return leadList.toSorted(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  );
};

export const getLeads = (): Lead[] => leads;

export const getLead = (leadId: string): Lead | undefined => {
  return leads.find((lead) => lead.id === leadId);
};
