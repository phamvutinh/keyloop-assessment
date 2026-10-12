import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LeadDetailRoute from "@/app/routes/lead-detail";
import LandingRoute from "@/app/routes/landing";
import LeadsRoute from "@/app/routes/leads";
import {
  fixtureActivities,
  getActivitiesForLead,
} from "@/features/activity/data";
import { leads } from "@/features/leads/data";
import type { Lead, LeadListResponse } from "@/types/api";
import { formatDateTime } from "@/utils/format";

const mocks = vi.hoisted(() => ({
  useLeads: vi.fn(),
  useLead: vi.fn(),
  useActivities: vi.fn(),
}));

vi.mock("@/features/leads/api/get-leads", () => ({
  useLeads: mocks.useLeads,
}));

vi.mock("@/features/leads/api/get-lead", () => ({
  useLead: mocks.useLead,
}));

vi.mock("@/features/activity/api/get-activities", () => ({
  useActivities: mocks.useActivities,
}));

const successfulQuery = <T,>(data: T) => ({
  data,
  error: null,
  isError: false,
  isPending: false,
  isSuccess: true,
  refetch: vi.fn(),
});

const successfulActivitiesQuery = (activities = fixtureActivities) => ({
  data: {
    pages: [{ items: activities, nextCursor: null }],
    pageParams: [null],
  },
  error: null,
  isError: false,
  isPending: false,
  isSuccess: true,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
  refetch: vi.fn(),
});

beforeEach(() => {
  mocks.useActivities.mockReturnValue(successfulActivitiesQuery());
});

const getLeadListPage = ({
  sourceLeads,
  page,
  pageSize,
  search = "",
}: {
  sourceLeads: Lead[];
  page: number;
  pageSize: number;
  search?: string;
}): LeadListResponse => {
  const normalizedSearch = search.trim().toLowerCase();
  const matchingLeads = sourceLeads
    .toSorted(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    )
    .filter((lead) =>
      normalizedSearch
        ? lead.name.toLowerCase().includes(normalizedSearch)
        : true,
    );
  const startIndex = (page - 1) * pageSize;

  return {
    items: matchingLeads.slice(startIndex, startIndex + pageSize),
    total: matchingLeads.length,
    page,
    pageSize,
  };
};

const successfulLeadListQuery = (
  sourceLeads: Lead[],
  page = 1,
  pageSize = 10,
  search = "",
) => successfulQuery(getLeadListPage({ sourceLeads, page, pageSize, search }));

const makeLead = (index: number): Lead => ({
  id: `lead-page-${index}`,
  name: `Page Lead ${index.toString().padStart(2, "0")}`,
  email: `page.lead.${index}@example.com`,
  phone: `+44 20 7000 ${index.toString().padStart(4, "0")}`,
  message: `Pagination fixture lead ${index}`,
  createdAt: `2026-02-${index.toString().padStart(2, "0")}T09:00:00.000Z`,
});

const renderRoutes = (initialEntry = "/leads") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/leads" element={<LeadsRoute />} />
          <Route path="/leads/:leadId" element={<LeadDetailRoute />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("lead browse and read workflow", () => {
  it("redirects from the root route to the lead list", async () => {
    mocks.useLeads.mockReturnValue(successfulLeadListQuery(leads));

    renderRoutes("/");

    expect(
      await screen.findByRole("heading", { name: "Lead list" }),
    ).toBeInTheDocument();
  });

  it("shows the requested lead list columns newest first", () => {
    mocks.useLeads.mockReturnValue(successfulLeadListQuery(leads));

    renderRoutes();

    expect(screen.queryByText("3 sample leads")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 10 of 12 leads")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Lead list pagination" }),
    ).toBeInTheDocument();

    for (const column of ["Customer", "Contact", "Inquiry", "Received"]) {
      expect(
        screen.getByRole("columnheader", { name: column }),
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByRole("columnheader", { name: "Action" }),
    ).not.toBeInTheDocument();

    const rows = screen.getAllByRole("row").slice(1);
    const expectedLeads = leads.toSorted(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );

    const expectedVisibleLeads = expectedLeads.slice(0, 10);

    expect(rows).toHaveLength(expectedVisibleLeads.length);

    expectedVisibleLeads.forEach((lead, index) => {
      const row = rows[index];
      const link = within(row).getByRole("link", {
        name: new RegExp(lead.name),
      });
      expect(link).toHaveAttribute("href", `/leads/${lead.id}`);
      if (lead.email) {
        expect(row).toHaveTextContent(lead.email);
      }
      if (lead.phone) {
        expect(row).toHaveTextContent(lead.phone);
      }
      expect(row).toHaveTextContent(lead.message.slice(0, 80));
      expect(row).toHaveTextContent(formatDateTime(lead.createdAt));
    });

    expect(
      screen.queryByText(/company|service|pipeline|last contact|view details/i),
    ).not.toBeInTheDocument();
  });

  it("searches lead names through the lead list API", async () => {
    const user = userEvent.setup();
    mocks.useLeads.mockImplementation(({ page, pageSize, search }) =>
      successfulLeadListQuery(leads, page, pageSize, search),
    );

    renderRoutes();

    const searchInput = screen.getByRole("searchbox", {
      name: "Search by lead name",
    });
    expect(screen.getByText("Showing 10 of 12 leads")).toBeInTheDocument();

    await user.type(searchInput, "Anna");

    expect(mocks.useLeads).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, pageSize: 10, search: "Anna" }),
    );
    expect(screen.getByText("Showing 1 of 1 leads")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Anna Reed/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Marcus Chen/ }),
    ).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, "Unknown lead");

    expect(
      screen.getByRole("heading", { name: "No matching leads" }),
    ).toBeInTheDocument();
  });

  it("paginates the lead table", async () => {
    const user = userEvent.setup();
    const paginatedLeads = Array.from({ length: 12 }, (_, index) =>
      makeLead(index + 1),
    );
    mocks.useLeads.mockImplementation(({ page, pageSize }) =>
      successfulLeadListQuery(paginatedLeads, page, pageSize),
    );

    renderRoutes();

    expect(screen.getByText("Showing 10 of 12 leads")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Page Lead 12/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Page Lead 02/ }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("Showing 2 of 12 leads")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Page Lead 02/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Page Lead 01/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Page Lead 12/ }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous page" }));

    expect(screen.getByText("Showing 10 of 12 leads")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Page Lead 12/ }),
    ).toBeInTheDocument();
  });

  it("opens a directly addressable lead detail route with exact fields and null contacts", () => {
    const lead = leads[2];
    mocks.useLead.mockReturnValue(successfulQuery(lead));

    renderRoutes(`/leads/${lead.id}`);

    expect(
      screen.getByRole("heading", { name: lead.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(lead.email!)).toBeInTheDocument();
    expect(screen.getByText("Not provided")).toBeInTheDocument();
    expect(screen.getByText(lead.message)).toBeInTheDocument();
    expect(
      screen.getByText(formatDateTime(lead.createdAt)),
    ).toBeInTheDocument();
    expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
  });

  it("shows activity notes newest first with recording times", () => {
    const lead = leads[0];
    const activities = getActivitiesForLead(lead.id);
    mocks.useLead.mockReturnValue(successfulQuery(lead));
    mocks.useActivities.mockReturnValue(successfulActivitiesQuery(activities));

    renderRoutes(`/leads/${lead.id}`);

    const history = screen
      .getByRole("heading", { name: "Activity history" })
      .closest("article");
    expect(history).not.toBeNull();
    const items = within(history!).getAllByRole("listitem");

    expect(items[0]).toHaveTextContent(activities[0].note);
    expect(items[0]).toHaveTextContent(formatDateTime(activities[0].createdAt));
    expect(items[1]).toHaveTextContent(activities[1].note);
    expect(Date.parse(activities[0].createdAt)).toBeGreaterThan(
      Date.parse(activities[1].createdAt),
    );
    expect(
      screen.queryByText(/type|title|completed date/i),
    ).not.toBeInTheDocument();
  });

  it("requests the alternate backend activity sort when the sort button is clicked", async () => {
    const user = userEvent.setup();
    const lead = leads[0];
    const newestActivities = getActivitiesForLead(lead.id, "newest");
    const oldestActivities = getActivitiesForLead(lead.id, "oldest");

    mocks.useLead.mockReturnValue(successfulQuery(lead));
    mocks.useActivities.mockImplementation(({ activitySort }) =>
      successfulActivitiesQuery(
        activitySort === "oldest" ? oldestActivities : newestActivities,
      ),
    );

    renderRoutes(`/leads/${lead.id}`);

    expect(screen.getByText("Newest first")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /sort activity history oldest first/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.useActivities).toHaveBeenLastCalledWith(
        expect.objectContaining({ activitySort: "oldest" }),
      );
    });
    expect(screen.getByText("Oldest first")).toBeInTheDocument();

    const history = screen
      .getByRole("heading", { name: "Activity history" })
      .closest("article");
    expect(history).not.toBeNull();
    expect(within(history!).getAllByRole("listitem")[0]).toHaveTextContent(
      oldestActivities[0].note,
    );
  });

  it("shows useful empty-list, empty-history, and unknown-lead states", async () => {
    const user = userEvent.setup();
    mocks.useLeads.mockReturnValue(successfulLeadListQuery([]));

    const emptyList = renderRoutes();

    expect(
      screen.getByRole("heading", { name: "No leads to review" }),
    ).toBeInTheDocument();
    emptyList.unmount();

    const lead = leads[1];
    mocks.useLead.mockReturnValue(successfulQuery(lead));
    mocks.useActivities.mockReturnValue(successfulActivitiesQuery([]));
    const emptyHistory = renderRoutes(`/leads/${lead.id}`);

    expect(
      screen.getByText(/No activity has been recorded/i),
    ).toBeInTheDocument();
    emptyHistory.unmount();

    mocks.useLead.mockReturnValue(successfulQuery(null));
    renderRoutes("/leads/unknown-lead");

    expect(
      screen.getByRole("heading", { name: "Lead not found" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Return to leads" }));
    expect(
      screen.getByRole("heading", { name: "No leads to review" }),
    ).toBeInTheDocument();
  });
});

describe("lead read boundary", () => {
  it("uses the exact Lead and typed LeadActivity contracts", () => {
    expect(Object.keys(leads[0]).sort()).toEqual([
      "createdAt",
      "email",
      "id",
      "message",
      "name",
      "phone",
    ]);
    expect(Object.keys(fixtureActivities[0]).sort()).toEqual([
      "createdAt",
      "id",
      "leadId",
      "note",
      "type",
    ]);
  });

  it("keeps seeded activity history associated to every lead", () => {
    const annaHistory = getActivitiesForLead(leads[0].id);

    expect(annaHistory).toHaveLength(6);
    expect(
      annaHistory.every((activity) => activity.leadId === leads[0].id),
    ).toBe(true);
    expect(
      leads.every((lead) =>
        getActivitiesForLead(lead.id).every(
          (activity) => activity.leadId === lead.id,
        ),
      ),
    ).toBe(true);
    expect(
      leads.every((lead) => getActivitiesForLead(lead.id).length > 0),
    ).toBe(true);
  });
});
