import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table";
import type { Lead } from "@/types/api";

import { ContactCell, CustomerCell, InquiryCell, ReceivedCell } from "./cells";

export const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, Lead>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Customer",
    cell: ({ row, getValue }) => (
      <CustomerCell lead={row.original} name={getValue()} />
    ),
  }),
  columnHelper.display({
    id: "contact",
    header: "Contact",
    cell: ({ row }) => <ContactCell lead={row.original} />,
  }),
  columnHelper.accessor("message", {
    header: "Inquiry",
    cell: ({ getValue }) => <InquiryCell message={getValue()} />,
  }),
  columnHelper.accessor("createdAt", {
    header: "Received",
    cell: ({ getValue }) => <ReceivedCell createdAt={getValue()} />,
  }),
]);
