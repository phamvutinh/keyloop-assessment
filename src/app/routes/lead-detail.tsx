import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router";
import type { ComponentType, SVGProps } from "react";

import { ApiError } from "@/components/errors/api-error";
import { RouteError } from "@/components/errors/route-error";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useLead } from "@/features/leads/api/get-lead";
import { formatDateTime } from "@/utils/format";
import { getInitials, getLeadStatusLabel } from "@/utils/lead";

const ContactValue = ({ value }: { value: string | null }) => {
  return <>{value ?? "Not provided"}</>;
};

type OutlineIcon = ComponentType<SVGProps<SVGSVGElement>>;

const DetailAction = ({
  icon: Icon,
  label,
}: {
  icon: OutlineIcon;
  label: string;
}) => (
  <button className="detail-action" type="button">
    <Icon className="hero-icon" aria-hidden="true" />
    <span>{label}</span>
  </button>
);

const LeadDetailRoute = () => {
  const { leadId } = useParams();
  const leadQuery = useLead({
    leadId: leadId ?? "",
    queryConfig: { enabled: Boolean(leadId) },
  });
  const lead = leadQuery.data;

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
          title="Unable to load lead"
          action={{
            label: "Try again",
            onClick: () => void leadQuery.refetch(),
          }}
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
        <section className="detail-page" aria-labelledby="detailTitle">
          <header className="detail-header">
            <Button
              asChild
              variant="secondary"
              size="sm"
              icon={<ArrowLeftIcon aria-hidden="true" />}
            >
              <Link to={paths.leads.path}>Back to leads</Link>
            </Button>
            <div className="detail-heading">
              <span className="detail-kicker">Lead profile</span>
              <h1 id="detailTitle">Lead details</h1>
            </div>
          </header>

          <section className="detail-identity" aria-labelledby="detailLeadName">
            <span className="avatar detail-avatar" aria-hidden="true">
              {getInitials(lead.name)}
            </span>
            <div className="detail-identity-copy">
              <div className="detail-identity-top">
                <span className="status">
                  {getLeadStatusLabel(lead.status)}
                </span>
              </div>
              <h2 className="detail-name" id="detailLeadName">
                {lead.name}
              </h2>
              <p className="detail-company">Website inquiry</p>
              <p className="detail-description">
                Review contact details, inquiry timing, and recent follow-up
                history for this lead.
              </p>
              <div className="detail-actions" aria-label="Lead actions">
                <DetailAction icon={PhoneIcon} label="Call" />
                <DetailAction icon={ChatBubbleLeftRightIcon} label="Message" />
                <DetailAction icon={EnvelopeIcon} label="Email" />
              </div>
            </div>
          </section>

          <div className="detail-layout">
            <article className="detail-card">
              <div className="detail-section-heading">
                <h2>Inquiry details</h2>
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
                <div className="detail-field">
                  <dt>Status</dt>
                  <dd>{getLeadStatusLabel(lead.status)}</dd>
                </div>
                <div className="detail-field detail-field-wide">
                  <dt>Message</dt>
                  <dd>{lead.message}</dd>
                </div>
              </dl>
            </article>

            <article className="detail-card">
              <div className="detail-section-heading">
                <h2>Activity history</h2>
                <span className="demo-tag">Newest first</span>
              </div>
              {lead.activities.length > 0 ? (
                <ol className="timeline-list">
                  {lead.activities.map((activity, index) => {
                    const Icon =
                      index === 0 ? ChatBubbleLeftRightIcon : PhoneIcon;

                    return (
                      <li key={activity.id} className="timeline-item">
                        <span className="timeline-marker" aria-hidden="true">
                          <Icon className="hero-icon" />
                        </span>
                        <div className="timeline-copy">
                          <div className="timeline-meta">
                            <strong className="timeline-title">
                              Follow-up note
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
                    );
                  })}
                </ol>
              ) : (
                <div className="timeline-empty">
                  <span className="timeline-marker" aria-hidden="true">
                    <PlusIcon className="hero-icon" />
                  </span>
                  <p>
                    No activity has been recorded for this lead yet. Return to
                    the lead list to review another inquiry.
                  </p>
                </div>
              )}
            </article>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
};

export { RouteError as ErrorBoundary };

export default LeadDetailRoute;
