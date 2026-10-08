import { describe, expect, it } from "vitest";

import { getActivitiesForLead } from "@/features/activity/data";
import { getLead } from "@/features/leads/api/get-lead";
import { getLeads } from "@/features/leads/api/get-leads";
import { leads } from "@/features/leads/data";

const exactLeadKeys = [
  "createdAt",
  "email",
  "id",
  "message",
  "name",
  "phone",
  "status",
];

const exactLeadActivityKeys = ["createdAt", "id", "leadId", "note"];

describe("lead MSW API mock", () => {
  it("serves a paginated lead list through the /api/leads mock endpoint", async () => {
    const result = await getLeads({ page: 2, pageSize: 5 });
    const expectedLeads = leads
      .toSorted(
        (left, right) =>
          Date.parse(right.createdAt) - Date.parse(left.createdAt),
      )
      .slice(5, 10);

    expect(result).toEqual({
      items: expectedLeads,
      total: leads.length,
      page: 2,
      pageSize: 5,
    });
    expect(Object.keys(result.items[0]).sort()).toEqual(exactLeadKeys);
  });

  it("serves filtered lead pages through the /api/leads mock endpoint", async () => {
    const result = await getLeads({
      page: 1,
      pageSize: 10,
      status: "contacted",
    });

    expect(result.total).toBe(4);
    expect(result.items).toHaveLength(4);
    expect(result.items.every((lead) => lead.status === "contacted")).toBe(
      true,
    );
  });

  it("serves lead details and newest-first activity history through MSW", async () => {
    const lead = leads[0];
    const result = await getLead({ leadId: lead.id });

    expect(result).toEqual({
      ...lead,
      activities: getActivitiesForLead(lead.id),
    });
    expect(Object.keys(result!.activities[0]).sort()).toEqual(
      exactLeadActivityKeys,
    );
    expect(Date.parse(result!.activities[0].createdAt)).toBeGreaterThan(
      Date.parse(result!.activities[1].createdAt),
    );
  });

  it("returns null for an unknown lead from the mock endpoint", async () => {
    await expect(getLead({ leadId: "unknown-lead" })).resolves.toBeNull();
  });
});
