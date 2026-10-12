import type { DefaultOptions, UseMutationOptions } from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

type AsyncFunction = (...args: never[]) => Promise<unknown>;
type QueryOptionsFunction = (...args: never[]) => unknown;

export type ApiFnReturnType<FnType extends AsyncFunction> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<T extends QueryOptionsFunction> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends AsyncFunction> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    Error,
    Parameters<MutationFnType>[0]
  >;
