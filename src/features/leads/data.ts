import type { Lead } from "@/types/api";

export const leads: Lead[] = [
  {
    id: "lead-anna-reed",
    name: "Anna Reed",
    email: "anna.reed@example.com",
    phone: "+44 20 7946 0123",
    message:
      "I saw the new electric hatchback online and would like to arrange a test drive this weekend.",
    status: "new",
    createdAt: "2026-01-12T09:18:00.000Z",
  },
  {
    id: "lead-marcus-chen",
    name: "Marcus Chen",
    email: null,
    phone: "+44 161 555 0188",
    message:
      "Please send pricing for a used family SUV with low mileage. I am comparing options before visiting.",
    status: "contacted",
    createdAt: "2026-01-13T14:42:00.000Z",
  },
  {
    id: "lead-priya-shah",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    phone: null,
    message:
      "I submitted an inquiry about part-exchanging my current vehicle and would like to know next steps.",
    status: "closed",
    createdAt: "2026-01-14T11:05:00.000Z",
  },
  {
    id: "lead-oliver-bennett",
    name: "Oliver Bennett",
    email: "oliver.bennett@example.com",
    phone: "+44 113 555 0144",
    message:
      "Could you confirm whether the compact hybrid advertised with delivery mileage is still available?",
    status: "new",
    createdAt: "2026-01-15T08:36:00.000Z",
  },
  {
    id: "lead-sofia-martinez",
    name: "Sofia Martinez",
    email: "sofia.martinez@example.com",
    phone: "+44 121 555 0197",
    message:
      "I would like to book a video appointment to discuss finance options for the nearly new saloon.",
    status: "contacted",
    createdAt: "2026-01-16T10:24:00.000Z",
  },
  {
    id: "lead-noah-wilson",
    name: "Noah Wilson",
    email: null,
    phone: "+44 141 555 0163",
    message:
      "Please let me know the trade-in estimate for my 2019 hatchback against the estate car on your site.",
    status: "closed",
    createdAt: "2026-01-17T12:50:00.000Z",
  },
  {
    id: "lead-emily-carter",
    name: "Emily Carter",
    email: "emily.carter@example.com",
    phone: null,
    message:
      "I am interested in the seven-seat SUV and need confirmation that it has ISOFIX points in the rear row.",
    status: "new",
    createdAt: "2026-01-18T15:12:00.000Z",
  },
  {
    id: "lead-james-patel",
    name: "James Patel",
    email: "james.patel@example.com",
    phone: "+44 151 555 0138",
    message:
      "Can someone call me about warranty cover and care plan pricing for the approved used coupe?",
    status: "contacted",
    createdAt: "2026-01-19T09:45:00.000Z",
  },
  {
    id: "lead-amelia-brooks",
    name: "Amelia Brooks",
    email: "amelia.brooks@example.com",
    phone: "+44 191 555 0127",
    message:
      "I completed the online form for a test drive but need to move the appointment to next Tuesday afternoon.",
    status: "closed",
    createdAt: "2026-01-20T16:08:00.000Z",
  },
  {
    id: "lead-ethan-morgan",
    name: "Ethan Morgan",
    email: null,
    phone: "+44 29 5555 0182",
    message:
      "Do you have any automatic city cars arriving this month in blue or silver with parking sensors?",
    status: "new",
    createdAt: "2026-01-21T11:32:00.000Z",
  },
  {
    id: "lead-isla-thompson",
    name: "Isla Thompson",
    email: "isla.thompson@example.com",
    phone: "+44 131 555 0159",
    message:
      "I want to compare monthly payments for petrol and electric versions before deciding which model to view.",
    status: "contacted",
    createdAt: "2026-01-22T13:18:00.000Z",
  },
  {
    id: "lead-lucas-hughes",
    name: "Lucas Hughes",
    email: "lucas.hughes@example.com",
    phone: null,
    message:
      "Thanks for the valuation. I have chosen another vehicle, so please close my inquiry for now.",
    status: "closed",
    createdAt: "2026-01-23T17:41:00.000Z",
  },
];

export const getLeads = (): Lead[] => leads;

export const getLead = (leadId: string): Lead | undefined => {
  return leads.find((lead) => lead.id === leadId);
};
