import type { LeadStatus } from "@/types/api";

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const getInquiryExcerpt = (message: string, maxLength = 120) => {
  if (message.length <= maxLength) {
    return message;
  }

  return `${message.slice(0, maxLength - 3).trimEnd()}…`;
};

export const getLeadStatusLabel = (status: LeadStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);
