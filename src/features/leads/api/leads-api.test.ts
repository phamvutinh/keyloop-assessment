import { describe, expect, it } from "vitest";

import { getActivities } from "@/features/activity/api/get-activities";
import { getLead } from "@/features/leads/api/get-lead";
import { getLeads } from "@/features/leads/api/get-leads";
import { leads, sortLeadsByNewest } from "@/features/leads/data";

const exactLeadKeys = ["createdAt", "email", "id", "message", "name", "phone"];
const exactLeadActivityKeys = ["createdAt", "id", "leadId", "note", "type"];

describe("lead MSW API mock", () => {
  it("provides a realistic mock lead volume", () => {
    expect(leads).toHaveLength(150);
  });

  it("serves a paginated lead list through the /api/leads mock endpoint", async () => {
    const result = await getLeads({ page: 2, pageSize: 5 });
    const expectedLeads = sortLeadsByNewest(leads).slice(5, 10);

    expect(result).toEqual({
      items: expectedLeads,
      total: leads.length,
      page: 2,
      pageSize: 5,
    });
    expect(Object.keys(result.items[0]).sort()).toEqual(exactLeadKeys);
  });

  it("filters the paginated lead list by lead name through the mock endpoint", async () => {
    const result = await getLeads({ page: 1, pageSize: 10, search: "anna" });

    expect(result.items).toEqual([leads[0]]);
    expect(result.total).toBe(1);
  });

  it("serves lead details without duplicating activity history", async () => {
    const lead = leads[0];

    await expect(getLead({ leadId: lead.id })).resolves.toEqual(lead);
  });

  it("serves cursor-paginated activity history without duplicate records", async () => {
    const lead = leads[0];
    const firstPage = await getActivities({ leadId: lead.id, limit: 1 });
    const secondPage = await getActivities({
      leadId: lead.id,
      limit: 1,
      cursor: firstPage.nextCursor,
    });

    expect(Object.keys(firstPage.items[0]).sort()).toEqual(
      exactLeadActivityKeys,
    );
    expect(firstPage.nextCursor).not.toBeNull();
    expect(secondPage.items[0].id).not.toBe(firstPage.items[0].id);
    expect([...firstPage.items, ...secondPage.items]).toHaveLength(2);
  });

  it("serves oldest-first activity history when requested", async () => {
    const lead = leads[0];
    const result = await getActivities({
      leadId: lead.id,
      activitySort: "oldest",
      limit: 5,
    });

    expect(Date.parse(result.items[0].createdAt)).toBeLessThan(
      Date.parse(result.items[1].createdAt),
    );
  });

  it("returns null for an unknown lead from the mock endpoint", async () => {
    await expect(getLead({ leadId: "unknown-lead" })).resolves.toBeNull();
  });
});
