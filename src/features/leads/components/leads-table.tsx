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

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

const boundaryPageCount = 2;
const siblingPageCount = 1;
const maxNumberedPageCount = 7;

const getCondensedPageItems = (
  currentPageIndex: number,
  pageCount: number,
): PaginationItem[] => {
  if (pageCount <= maxNumberedPageCount) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const currentPageNumber = currentPageIndex + 1;
  const visiblePageNumbers = new Set<number>();

  for (let pageNumber = 1; pageNumber <= boundaryPageCount; pageNumber += 1) {
    visiblePageNumbers.add(pageNumber);
  }

  for (
    let pageNumber = pageCount - boundaryPageCount + 1;
    pageNumber <= pageCount;
    pageNumber += 1
  ) {
    visiblePageNumbers.add(pageNumber);
  }

  const siblingStart = Math.max(
    boundaryPageCount + 1,
    currentPageNumber - siblingPageCount,
  );
  const siblingEnd = Math.min(
    pageCount - boundaryPageCount,
    currentPageNumber + siblingPageCount,
  );

  for (
    let pageNumber = siblingStart;
    pageNumber <= siblingEnd;
    pageNumber += 1
  ) {
    visiblePageNumbers.add(pageNumber);
  }

  const sortedPageNumbers = [...visiblePageNumbers].toSorted(
    (left, right) => left - right,
  );

  return sortedPageNumbers.reduce<PaginationItem[]>((items, pageNumber) => {
    const previousItem = items.at(-1);

    if (typeof previousItem === "number") {
      const gap = pageNumber - previousItem;

      if (gap === 2) {
        items.push(previousItem + 1);
      }

      if (gap > 2) {
        items.push(
          previousItem < currentPageNumber ? "ellipsis-start" : "ellipsis-end",
        );
      }
    }

    items.push(pageNumber);
    return items;
  }, []);
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
  const pageItems = getCondensedPageItems(
    currentPageIndex,
    table.getPageCount(),
  );

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
          {pageItems.map((item) => {
            if (typeof item === "string") {
              return (
                <span key={item} className="page-ellipsis" aria-hidden="true">
                  ...
                </span>
              );
            }

            const pageIndex = item - 1;
            const isCurrentPage = pageIndex === currentPageIndex;

            return (
              <button
                key={item}
                className="page-button"
                type="button"
                aria-current={isCurrentPage ? "page" : undefined}
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {item}
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
