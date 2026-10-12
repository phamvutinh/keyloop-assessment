import { useTable } from "@tanstack/react-table";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

import type { Lead } from "@/types/api";

import { columns, features } from "./columns";

type LeadsTableProps = {
  leads: Lead[];
  pagination: PaginationState;
  totalLeads: number;
  onPaginationChange: OnChangeFn<PaginationState>;
};

export const LeadsTable = ({
  leads,
  pagination,
  totalLeads,
  onPaginationChange,
}: LeadsTableProps) => {
  const table = useTable({
    features,
    data: leads,
    columns,
    state: { pagination },
    onPaginationChange,
    rowCount: totalLeads,
    manualPagination: true,
  });

  const currentPageIndex = table.state.pagination.pageIndex;
  const paginatedLeadCount = table.getRowModel().rows.length;

  return (
    <>
      <div className="table-scroll">
        <table className="lead-table" aria-label="Lead list">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col">
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => {
                  const header = cell.column.columnDef.header;
                  const label = typeof header === "string" ? header : undefined;

                  return (
                    <td key={cell.id} data-label={label}>
                      <table.FlexRender cell={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="table-footer">
        <span aria-live="polite">
          Showing {paginatedLeadCount} of {totalLeads} leads
        </span>
        <nav className="pagination" aria-label="Lead list pagination">
          <button
            className="page-button"
            type="button"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            ‹
          </button>
          {table.getPageOptions().map((pageIndex) => {
            const pageNumber = pageIndex + 1;
            const isCurrentPage = pageIndex === currentPageIndex;

            return (
              <button
                key={pageNumber}
                className="page-button"
                type="button"
                aria-current={isCurrentPage ? "page" : undefined}
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            className="page-button"
            type="button"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            ›
          </button>
        </nav>
      </footer>
    </>
  );
};
