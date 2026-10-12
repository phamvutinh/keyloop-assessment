import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import LeadDetailRoute from "@/app/routes/lead-detail";
import LeadsRoute from "@/app/routes/leads";
import { AppProvider } from "@/app/provider";
import { activityStorageKey } from "@/features/activity/storage";
import { leads } from "@/features/leads/data";
import { server } from "@/mocks/server";

const renderLeadDetail = (leadId = leads[0].id) => {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[`/leads/${leadId}`]}>
        <Routes>
          <Route path="/leads" element={<LeadsRoute />} />
          <Route path="/leads/:leadId" element={<LeadDetailRoute />} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
};

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("completed Follow-up recording", () => {
  it("shows explicit recovery for corrupt saved Follow-up data", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(activityStorageKey, "not json");

    renderLeadDetail();

    expect(
      await screen.findByText("Unable to load saved follow-up history"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/removes locally saved Follow-up notes/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Remove locally saved Follow-ups" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Anna Reed" }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(activityStorageKey)).toBeNull();
  });

  it("opens the follow-up modal and saves a completed Follow-up after durable storage", async () => {
    const user = userEvent.setup();
    renderLeadDetail();

    await user.click(
      await screen.findByRole("button", { name: "Add follow-up" }),
    );

    const noteInput = screen.getByRole("textbox", {
      name: "Follow-up note",
    });

    expect(screen.getByLabelText("Activity type")).toBeInTheDocument();
    expect(screen.queryByLabelText(/date|time|title/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add activity" }));
    expect(
      screen.getByText("Enter a follow-up note before saving."),
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Activity type"), "email");
    await user.type(noteInput, "Customer confirmed they can visit after work.");
    await user.click(screen.getByRole("button", { name: "Add activity" }));

    expect(
      await screen.findByText("Follow-up note saved."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Follow-up note" }),
    ).not.toBeInTheDocument();

    const history = screen
      .getByRole("heading", { name: "Activity history" })
      .closest("article");
    expect(history).not.toBeNull();
    const firstItem = within(history!).getAllByRole("listitem")[0];
    expect(firstItem).toHaveTextContent("Email");
    expect(firstItem).toHaveTextContent(
      "Customer confirmed they can visit after work.",
    );
    expect(firstItem.querySelector("time")?.getAttribute("datetime")).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });

  it("loads the next activity batch without duplicating history", async () => {
    const user = userEvent.setup();
    renderLeadDetail();

    expect(
      await screen.findByText(
        "Confirmed preferred test drive time and sent showroom address.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load more" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(
      await screen.findByText(
        "Created the initial follow-up record from the website inquiry.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load more" }),
    ).not.toBeInTheDocument();
    const history = screen
      .getByRole("heading", { name: "Activity history" })
      .closest("article");
    expect(history).not.toBeNull();
    expect(within(history!).getAllByRole("listitem")).toHaveLength(6);
  });

  it("keeps the selected backend sort after saving a follow-up", async () => {
    const user = userEvent.setup();
    renderLeadDetail();

    await user.click(
      await screen.findByRole("button", {
        name: /sort activity history oldest first/i,
      }),
    );
    expect(await screen.findByText("Oldest first")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add follow-up" }));
    await user.type(
      screen.getByRole("textbox", { name: "Follow-up note" }),
      "Customer wants a weekend appointment.",
    );
    await user.click(screen.getByRole("button", { name: "Add activity" }));

    expect(
      await screen.findByText("Follow-up note saved."),
    ).toBeInTheDocument();

    const history = screen
      .getByRole("heading", { name: "Activity history" })
      .closest("article");
    expect(history).not.toBeNull();
    expect(within(history!).getAllByRole("listitem")[0]).toHaveTextContent(
      "Created the initial follow-up record from the website inquiry.",
    );

    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(
      await within(history!).findByText(
        "Customer wants a weekend appointment.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the draft note and activity type when cancelled and reopened", async () => {
    const user = userEvent.setup();
    renderLeadDetail();

    await user.click(
      await screen.findByRole("button", { name: "Add follow-up" }),
    );
    await user.selectOptions(screen.getByLabelText("Activity type"), "email");
    await user.type(
      screen.getByRole("textbox", { name: "Follow-up note" }),
      "Keep this draft.",
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Add follow-up" }));

    expect(screen.getByRole("textbox", { name: "Follow-up note" })).toHaveValue(
      "Keep this draft.",
    );
    expect(screen.getByLabelText("Activity type")).toHaveValue("email");
  });

  it("resets the form to a blank call note after a successful save", async () => {
    const user = userEvent.setup();
    renderLeadDetail();

    await user.click(
      await screen.findByRole("button", { name: "Add follow-up" }),
    );
    await user.selectOptions(screen.getByLabelText("Activity type"), "message");
    await user.type(
      screen.getByRole("textbox", { name: "Follow-up note" }),
      "Saved once.",
    );
    await user.click(screen.getByRole("button", { name: "Add activity" }));
    await screen.findByText("Follow-up note saved.");

    await user.click(screen.getByRole("button", { name: "Add follow-up" }));

    expect(screen.getByRole("textbox", { name: "Follow-up note" })).toHaveValue(
      "",
    );
    expect(screen.getByLabelText("Activity type")).toHaveValue("call");
  });

  it("shows retryable feedback when locally saved Follow-ups cannot be removed", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(activityStorageKey, "not json");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Local storage is unavailable.");
    });

    renderLeadDetail();

    await user.click(
      await screen.findByRole("button", {
        name: "Remove locally saved Follow-ups",
      }),
    );

    expect(
      await screen.findByText("Local storage is unavailable."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Unable to load saved follow-up history"),
    ).toBeInTheDocument();
  });

  it("retains the note and shows retry guidance when saving fails", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("/api/leads/:leadId/activities", () =>
        HttpResponse.json(
          { message: "Local storage is unavailable." },
          { status: 500 },
        ),
      ),
    );
    renderLeadDetail();

    await user.click(
      await screen.findByRole("button", { name: "Add follow-up" }),
    );
    const noteInput = screen.getByRole("textbox", {
      name: "Follow-up note",
    });
    await user.selectOptions(screen.getByLabelText("Activity type"), "message");
    await user.type(noteInput, "Please retry this note.");
    await user.click(screen.getByRole("button", { name: "Add activity" }));

    expect(
      await screen.findByText(
        /Local storage is unavailable.*try saving again/i,
      ),
    ).toBeInTheDocument();
    expect(noteInput).toHaveValue("Please retry this note.");
    expect(screen.getByLabelText("Activity type")).toHaveValue("message");
    expect(screen.queryByText("Follow-up note saved.")).not.toBeInTheDocument();
  });
});
