export const leadStatuses = ["new", "contacted", "closed"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

export type LeadListResponse = {
  items: Lead[];
  total: number;
  page: number;
  pageSize: number;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  note: string;
  createdAt: string;
};

export type LeadDetails = Lead & {
  activities: LeadActivity[];
};
