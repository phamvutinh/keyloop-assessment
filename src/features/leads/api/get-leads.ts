import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { LeadListResponse, LeadStatus } from "@/types/api";

export type GetLeadsParams = {
  page: number;
  pageSize: number;
  status?: LeadStatus;
};

export const getLeads = async ({
  page,
  pageSize,
  status,
}: GetLeadsParams): Promise<LeadListResponse> => {
  return api.get<LeadListResponse>("/leads", {
    params: { page, pageSize, status },
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
