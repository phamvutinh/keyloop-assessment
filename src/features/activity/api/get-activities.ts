import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { ActivityPage, ActivitySort } from "@/types/api";

export const ACTIVITIES_PER_PAGE = 5;

export type GetActivitiesParams = {
  leadId: string;
  activitySort?: ActivitySort;
  limit?: number;
  cursor?: string | null;
  signal?: AbortSignal;
};

export const getActivities = async ({
  leadId,
  activitySort = "newest",
  limit = ACTIVITIES_PER_PAGE,
  cursor = null,
  signal,
}: GetActivitiesParams): Promise<ActivityPage> =>
  api.get<ActivityPage>(`/leads/${leadId}/activities`, {
    params: { sort: activitySort, limit, cursor },
    signal,
  });

export const getActivitiesQueryOptions = ({
  leadId,
  activitySort = "newest",
  limit = ACTIVITIES_PER_PAGE,
}: Omit<GetActivitiesParams, "cursor" | "signal">) =>
  infiniteQueryOptions({
    queryKey: ["leadActivities", leadId, { activitySort, limit }],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      getActivities({ leadId, activitySort, limit, cursor: pageParam, signal }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

type UseActivitiesOptions = Omit<GetActivitiesParams, "cursor" | "signal"> & {
  queryConfig?: { enabled?: boolean };
};

export const useActivities = ({
  queryConfig,
  ...params
}: UseActivitiesOptions) =>
  useInfiniteQuery({
    ...getActivitiesQueryOptions(params),
    ...queryConfig,
  });
