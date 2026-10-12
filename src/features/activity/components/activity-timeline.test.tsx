import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActivityTimeline } from "@/features/activity/components/activity-timeline";
import type { LeadActivity } from "@/types/api";

const activities: LeadActivity[] = [
  {
    id: "activity-1",
    leadId: "lead-1",
    type: "call",
    note: "Confirmed the test drive time.",
    createdAt: "2026-01-12T13:30:00.000Z",
  },
];

describe("ActivityTimeline", () => {
  it("keeps existing history and offers retry when loading more fails", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();

    render(
      <ActivityTimeline
        activities={activities}
        activitySort="newest"
        successMessage=""
        isLoading={false}
        isSaving={false}
        onToggleSort={vi.fn()}
        onAddFollowUp={vi.fn()}
        pagination={{
          isError: true,
          hasNextPage: true,
          isFetchingNextPage: false,
          onLoadMore,
        }}
      />,
    );

    expect(screen.getByText(activities[0].note)).toBeInTheDocument();
    expect(
      screen.getByText("Unable to load more activity history. Try again."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load more" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
