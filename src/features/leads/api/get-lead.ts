import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { LeadDetails } from "@/types/api";

export type GetLeadParams = {
  leadId: string;
};

export const getLead = async ({
  leadId,
}: GetLeadParams): Promise<LeadDetails | null> =>
  api.get<LeadDetails | null>(`/leads/${leadId}`);

export const getLeadQueryOptions = ({ leadId }: GetLeadParams) =>
  queryOptions({
    queryKey: ["lead", leadId],
    queryFn: () => getLead({ leadId }),
  });

type UseLeadOptions = GetLeadParams & {
  queryConfig?: QueryConfig<typeof getLeadQueryOptions>;
};

export const useLead = ({ queryConfig, ...params }: UseLeadOptions) => {
  return useQuery({
    ...getLeadQueryOptions(params),
    ...queryConfig,
  });
};
