import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { LeadDetails } from "@/types/api";

export const getLead = async ({
  leadId,
}: {
  leadId: string;
}): Promise<LeadDetails | null> => {
  return api.get<LeadDetails | null>(`/leads/${leadId}`);
};

export const getLeadQueryOptions = (leadId: string) => {
  return queryOptions({
    queryKey: ["lead", leadId],
    queryFn: () => getLead({ leadId }),
  });
};

type UseLeadOptions = {
  leadId: string;
  queryConfig?: QueryConfig<typeof getLeadQueryOptions>;
};

export const useLead = ({ leadId, queryConfig }: UseLeadOptions) => {
  return useQuery({
    ...getLeadQueryOptions(leadId),
    ...queryConfig,
  });
};
