import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { LeadListResponse } from "@/types/api";

export type GetLeadsParams = {
  page: number;
  pageSize: number;
  search?: string;
};

export const getLeads = async ({
  page,
  pageSize,
  search,
}: GetLeadsParams): Promise<LeadListResponse> => {
  const normalizedSearch = search?.trim();

  return api.get<LeadListResponse>("/leads", {
    params: { page, pageSize, search: normalizedSearch || undefined },
  });
};

export const getLeadsQueryOptions = (params: GetLeadsParams) => {
  return queryOptions({
    queryKey: ["leads", params],
    queryFn: () => getLeads(params),
    placeholderData: keepPreviousData,
  });
};

type UseLeadsOptions = GetLeadsParams & {
  queryConfig?: QueryConfig<typeof getLeadsQueryOptions>;
};

export const useLeads = ({ queryConfig, ...params }: UseLeadsOptions) => {
  return useQuery({
    ...getLeadsQueryOptions(params),
    ...queryConfig,
  });
};
