import { useState } from "react";
import { Link, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/components/errors/api-error";
import { RouteError } from "@/components/errors/route-error";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ActivityRecoveryCard } from "@/features/activity/components/activity-recovery-card";
import { ActivityTimeline } from "@/features/activity/components/activity-timeline";
import {
  FollowUpModal,
  type FollowUpInput,
} from "@/features/activity/components/follow-up-modal";
import { useActivities } from "@/features/activity/api/get-activities";
import { useSaveFollowUp } from "@/features/activity/api/save-follow-up";
import { useLead } from "@/features/leads/api/get-lead";
import { ContactValue } from "@/features/leads/components/contact-value";
import type { ActivitySort } from "@/types/api";
import { formatDateTime } from "@/utils/format";
import { getInitials } from "@/utils/lead";

const LeadDetailRoute = () => {
  const { leadId } = useParams();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [activitySort, setActivitySort] = useState<ActivitySort>("newest");
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const leadQuery = useLead({
    leadId: leadId ?? "",
    queryConfig: { enabled: Boolean(leadId) },
  });
  const activitiesQuery = useActivities({
    leadId: leadId ?? "",
    activitySort,
    queryConfig: { enabled: Boolean(leadId) },
  });
  const saveFollowUp = useSaveFollowUp({
    mutationConfig: {
      onSuccess: async (_activity, variables) => {
        await queryClient.cancelQueries({
          queryKey: ["leadActivities", variables.leadId],
        });
        await queryClient.resetQueries({
          queryKey: ["leadActivities", variables.leadId],
        });
        setSuccessMessage("Follow-up note saved.");
        setIsFollowUpModalOpen(false);
      },
    },
  });
  const lead = leadQuery.data;
  const activities = Array.from(
    new Map(
      (activitiesQuery.data?.pages.flatMap((page) => page.items) ?? []).map(
        (activity) => [activity.id, activity],
      ),
    ).values(),
  );

  const handleSaveFollowUp = async ({ type, note }: FollowUpInput) => {
    if (!leadId) {
      return false;
    }

    setSuccessMessage("");

    try {
      await saveFollowUp.mutateAsync({ leadId, type, note });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppShell current="Manage Leads" detailName={lead?.name ?? "Lead details"}>
      {!leadId ? (
        <ApiError
          error={new Error("Missing lead identifier.")}
          title="Unable to load lead"
        />
      ) : null}

      {leadQuery.isPending && leadId ? (
        <p className="mb-0 text-secondary">Loading lead details.</p>
      ) : null}

      {leadQuery.isError ? (
        <ApiError
          error={leadQuery.error}
          title="Unable to load lead details"
          action={{
            label: "Try again",
            onClick: () => void leadQuery.refetch(),
          }}
        />
      ) : null}

      {activitiesQuery.isError && activities.length === 0 ? (
        <ActivityRecoveryCard
          error={activitiesQuery.error}
          onRetry={() => void activitiesQuery.refetch()}
        />
      ) : null}

      {leadQuery.isSuccess && lead === null ? (
        <div className="empty-card">
          <h1 className="mb-2">Lead not found</h1>
          <p className="mb-4 text-secondary">
            This lead URL does not match a fictional website inquiry in the
            sample data.
          </p>
          <Button asChild variant="primary" size="sm">
            <Link to={paths.leads.path}>Return to leads</Link>
          </Button>
        </div>
      ) : null}

      {leadQuery.isSuccess && lead ? (
        <section className="detail-page" aria-labelledby="detailLeadName">
          <section className="detail-identity" aria-labelledby="detailLeadName">
            <div className="detail-identity-summary">
              <span className="avatar detail-avatar" aria-hidden="true">
                {getInitials(lead.name)}
              </span>
              <div className="detail-identity-copy">
                <h2 className="detail-name" id="detailLeadName">
                  {lead.name}
                </h2>
                <p className="detail-company">Website inquiry</p>
                <p className="detail-description">
                  Review contact details, inquiry timing, and recent follow-up
                  history for this lead.
                </p>
              </div>
            </div>
            <section
              className="detail-identity-fields"
              aria-labelledby="detailFieldsTitle"
            >
              <div className="detail-section-heading">
                <h2 id="detailFieldsTitle">Full details</h2>
                <span className="demo-tag">Sample record</span>
              </div>
              <dl className="detail-grid-list">
                <div className="detail-field">
                  <dt>Email</dt>
                  <dd>
                    <ContactValue value={lead.email} />
                  </dd>
                </div>
                <div className="detail-field">
                  <dt>Phone</dt>
                  <dd>
                    <ContactValue value={lead.phone} />
                  </dd>
                </div>
                <div className="detail-field">
                  <dt>Inquiry received</dt>
                  <dd>
                    <time dateTime={lead.createdAt}>
                      {formatDateTime(lead.createdAt)}
                    </time>
                  </dd>
                </div>
                <div className="detail-field detail-field-wide">
                  <dt>Message</dt>
                  <dd>{lead.message}</dd>
                </div>
              </dl>
            </section>
          </section>

          <div className="detail-layout">
            <ActivityTimeline
              activities={activities}
              activitySort={activitySort}
              successMessage={successMessage}
              isLoading={activitiesQuery.isPending}
              isSaving={saveFollowUp.isPending}
              onToggleSort={() =>
                setActivitySort((current) =>
                  current === "newest" ? "oldest" : "newest",
                )
              }
              onAddFollowUp={() => {
                setSuccessMessage("");
                saveFollowUp.reset();
                setIsFollowUpModalOpen(true);
              }}
              pagination={{
                isError: activitiesQuery.isError,
                hasNextPage: Boolean(activitiesQuery.hasNextPage),
                isFetchingNextPage: activitiesQuery.isFetchingNextPage,
                onLoadMore: () => void activitiesQuery.fetchNextPage(),
              }}
            />
          </div>
        </section>
      ) : null}

      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        isSaving={saveFollowUp.isPending}
        saveError={saveFollowUp.isError ? saveFollowUp.error.message : ""}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSubmit={handleSaveFollowUp}
        onResetSaveError={saveFollowUp.reset}
      />
    </AppShell>
  );
};

export { RouteError as ErrorBoundary };

export default LeadDetailRoute;
