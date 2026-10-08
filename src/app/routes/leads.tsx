import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

import { ApiError } from "@/components/errors/api-error";
import { RouteError } from "@/components/errors/route-error";
import { AppShell } from "@/components/layout/app-shell";
import { useLeads } from "@/features/leads/api/get-leads";
import { LeadsTable } from "@/features/leads/components/leads-table";
import { leadStatuses, type LeadStatus } from "@/types/api";
import { getLeadStatusLabel } from "@/utils/lead";

const LEADS_PER_PAGE = 10;

const LeadsRoute = () => {
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: LEADS_PER_PAGE,
  });
  const leadsQuery = useLeads({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    status: statusFilter || undefined,
  });
  const leadList = leadsQuery.data;
  const leads = leadList?.items ?? [];

  return (
    <AppShell current="Manage Leads">
      <div className="page-heading">
        <div>
          <h1>All Leads</h1>
        </div>
      </div>

      <section className="lead-panel" aria-labelledby="leadListTitle">
        <div className="panel-toolbar">
          <h2 className="panel-title" id="leadListTitle">
            Lead list
          </h2>
          <div className="table-tools" aria-label="List tools">
            <label className="status-filter-field">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as LeadStatus | "");
                  setPagination((current) => ({ ...current, pageIndex: 0 }));
                }}
              >
                <option value="">All statuses</option>
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getLeadStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {leadsQuery.isPending ? (
          <p className="m-0 p-5 text-secondary">Loading leads.</p>
        ) : null}

        {leadsQuery.isError ? (
          <div className="p-5">
            <ApiError
              error={leadsQuery.error}
              title="Unable to load leads"
              action={{
                label: "Try again",
                onClick: () => void leadsQuery.refetch(),
              }}
            />
          </div>
        ) : null}

        {leadsQuery.isSuccess && leads.length === 0 ? (
          <div className="empty-card m-4">
            <h2 className="mb-2 text-xl font-semibold">No leads to review</h2>
            <p className="mb-0 text-secondary">
              There are no sample website inquiries available right now. Return
              to this page after seeded leads are available.
            </p>
          </div>
        ) : null}

        {leadsQuery.isSuccess && leadList && leads.length > 0 ? (
          <LeadsTable
            leads={leads}
            pagination={pagination}
            totalLeads={leadList.total}
            onPaginationChange={setPagination}
          />
        ) : null}
      </section>
    </AppShell>
  );
};

export { RouteError as ErrorBoundary };

export default LeadsRoute;
