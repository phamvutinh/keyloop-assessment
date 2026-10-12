export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  createdAt: string;
};

export type LeadListResponse = {
  items: Lead[];
  total: number;
  page: number;
  pageSize: number;
};

export const activityTypes = ["call", "email", "message"] as const;

export type ActivityType = (typeof activityTypes)[number];

export type LeadActivity = {
  id: string;
  leadId: string;
  type: ActivityType | null;
  note: string;
  createdAt: string;
};

export type ActivitySort = "newest" | "oldest";

export type ActivityPage = {
  items: LeadActivity[];
  nextCursor: string | null;
};

export type LeadDetails = Lead;
