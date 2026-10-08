import { http, HttpResponse } from "msw";

import { getActivitiesForLead } from "@/features/activity/data";
import { getLead, getLeads } from "@/features/leads/data";

export const handlers = [
  http.get("/api/leads", ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.max(
      1,
      Number(url.searchParams.get("pageSize") ?? 10),
    );
    const status = url.searchParams.get("status");
    const matchingLeads = getLeads()
      .filter((lead) => !status || lead.status === status)
      .sort(
        (left, right) =>
          Date.parse(right.createdAt) - Date.parse(left.createdAt),
      );
    const startIndex = (page - 1) * pageSize;

    return HttpResponse.json({
      items: matchingLeads.slice(startIndex, startIndex + pageSize),
      total: matchingLeads.length,
      page,
      pageSize,
    });
  }),

  http.get("/api/leads/:leadId", ({ params }) => {
    const leadId = String(params.leadId);
    const lead = getLead(leadId);

    if (!lead) {
      return HttpResponse.json(null);
    }

    return HttpResponse.json({
      ...lead,
      activities: getActivitiesForLead(leadId),
    });
  }),
];
