import { http, HttpResponse } from "msw";

import {
  getActivityPageForLead,
  saveFollowUpActivity,
} from "@/features/activity/storage";
import { validateFollowUpInput } from "@/features/activity/validation";
import { getLead, getLeads, sortLeadsByNewest } from "@/features/leads/data";

type FollowUpRequestBody = {
  type?: unknown;
  note?: unknown;
};

const isFollowUpRequestBody = (value: unknown): value is FollowUpRequestBody =>
  typeof value === "object" && value !== null;

export const handlers = [
  http.get("/api/leads", ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.max(
      1,
      Number(url.searchParams.get("pageSize") ?? 10),
    );
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const matchingLeads = sortLeadsByNewest(getLeads()).filter((lead) =>
      search ? lead.name.toLowerCase().includes(search) : true,
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
    const lead = getLead(String(params.leadId));

    return HttpResponse.json(lead ?? null);
  }),

  http.get("/api/leads/:leadId/activities", ({ params, request }) => {
    const url = new URL(request.url);
    const leadId = String(params.leadId);
    const lead = getLead(leadId);
    const sort =
      url.searchParams.get("sort") === "oldest" ? "oldest" : "newest";
    const requestedLimit = Number(url.searchParams.get("limit") ?? 5);

    if (!lead) {
      return HttpResponse.json(
        { message: "Choose a known lead before viewing activity history." },
        { status: 404 },
      );
    }

    if (
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1 ||
      requestedLimit > 50
    ) {
      return HttpResponse.json(
        { message: "Activity limit must be between 1 and 50." },
        { status: 400 },
      );
    }

    try {
      return HttpResponse.json(
        getActivityPageForLead({
          leadId,
          sort,
          limit: requestedLimit,
          cursor: url.searchParams.get("cursor"),
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Saved follow-up data could not be read.";
      const status = message.startsWith("Activity cursor") ? 400 : 409;

      return HttpResponse.json({ message }, { status });
    }
  }),

  http.post("/api/leads/:leadId/activities", async ({ params, request }) => {
    const leadId = String(params.leadId);
    const body = await request.json().catch(() => null);
    const followUpBody = isFollowUpRequestBody(body) ? body : null;
    const validation = validateFollowUpInput({
      leadId,
      type: followUpBody?.type,
      note: followUpBody?.note,
    });

    if (!validation.ok) {
      return HttpResponse.json(
        { message: validation.error.message },
        { status: validation.error.status },
      );
    }

    try {
      return HttpResponse.json(saveFollowUpActivity(validation.value), {
        status: 201,
      });
    } catch (error) {
      return HttpResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Unable to save the follow-up note.",
        },
        { status: 500 },
      );
    }
  }),
];
