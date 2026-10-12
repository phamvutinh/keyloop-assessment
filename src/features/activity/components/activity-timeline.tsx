import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { activityTypeLabels } from "@/features/activity/constants";
import type { ActivitySort, LeadActivity } from "@/types/api";
import { formatDateTime } from "@/utils/format";

type ActivityTimelinePagination = {
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

type ActivityTimelineProps = {
  activities: LeadActivity[];
  activitySort: ActivitySort;
  successMessage: string;
  isLoading: boolean;
  isSaving: boolean;
  onToggleSort: () => void;
  onAddFollowUp: () => void;
  pagination: ActivityTimelinePagination;
};

export const ActivityTimeline = ({
  activities,
  activitySort,
  successMessage,
  isLoading,
  isSaving,
  onToggleSort,
  onAddFollowUp,
  pagination,
}: ActivityTimelineProps) => {
  return (
    <article
      className="detail-card detail-section"
      aria-labelledby="activityTitle"
    >
      <div className="detail-section-heading">
        <h2 id="activityTitle">Activity history</h2>
        <div className="activity-heading-actions">
          <Button
            className="activity-sort-button"
            type="button"
            variant="secondary"
            size="sm"
            icon={
              activitySort === "newest" ? <ArrowDownIcon /> : <ArrowUpIcon />
            }
            aria-pressed={activitySort === "oldest"}
            aria-label={`Sort activity history ${
              activitySort === "newest" ? "oldest first" : "newest first"
            }`}
            onClick={onToggleSort}
          >
            {activitySort === "newest" ? "Newest first" : "Oldest first"}
          </Button>
          <Button
            className="activity-add-button"
            type="button"
            variant="primary"
            size="sm"
            icon={<PlusIcon />}
            onClick={onAddFollowUp}
          >
            Add follow-up
          </Button>
        </div>
      </div>
      {successMessage ? (
        <p className="m-0 leading-normal text-accent-dark" aria-live="polite">
          {successMessage}
        </p>
      ) : null}
      {isLoading ? (
        <p className="m-0 text-secondary">Loading activity history.</p>
      ) : activities.length > 0 ? (
        <>
          <ol className="timeline-list">
            {activities.map((activity) => (
              <li key={activity.id} className="timeline-item">
                <span className="timeline-marker" aria-hidden="true">
                  <ChatBubbleLeftRightIcon className="hero-icon" />
                </span>
                <div className="timeline-copy">
                  <div className="timeline-meta">
                    <strong className="timeline-title">
                      {activity.type
                        ? activityTypeLabels[activity.type]
                        : "Follow-up note"}
                    </strong>
                    <time
                      className="timeline-time"
                      dateTime={activity.createdAt}
                    >
                      {formatDateTime(activity.createdAt)}
                    </time>
                  </div>
                  <p>{activity.note}</p>
                </div>
              </li>
            ))}
          </ol>
          {pagination.isError ? null : pagination.hasNextPage ? (
            <Button
              className="activity-load-more"
              type="button"
              variant="secondary"
              size="sm"
              aria-label="Load more"
              isLoading={pagination.isFetchingNextPage}
              disabled={isSaving}
              onClick={pagination.onLoadMore}
            >
              Load more follow-ups
            </Button>
          ) : null}
          {pagination.isError ? (
            <div className="mt-4" role="alert">
              <p className="m-0 text-alert">
                Unable to load more activity history. Try again.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={pagination.onLoadMore}
              >
                Try again
              </Button>
            </div>
          ) : null}
        </>
      ) : pagination.isError ? null : (
        <div className="timeline-empty">
          <span className="timeline-marker" aria-hidden="true">
            <PlusIcon className="hero-icon" />
          </span>
          <p>
            No activity has been recorded for this lead yet. Use the Add
            follow-up button to record completed work.
          </p>
        </div>
      )}
    </article>
  );
};
