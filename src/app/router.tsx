import { useQueryClient } from "@tanstack/react-query";
import { useMemo, type ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import type { ActionFunction, LoaderFunction } from "react-router";
import type { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";

import { paths } from "@/config/paths";

type LazyRouteModule = Record<string, unknown> & {
  default: ComponentType;
  clientLoader?: (queryClient: QueryClient) => LoaderFunction;
  clientAction?: (queryClient: QueryClient) => ActionFunction;
};

const isLazyRouteModule = (module: unknown): module is LazyRouteModule => {
  return (
    typeof module === "object" &&
    module !== null &&
    "default" in module &&
    typeof module.default === "function"
  );
};

const convert = (queryClient: QueryClient) => (module: unknown) => {
  if (!isLazyRouteModule(module)) {
    throw new Error("Route module must export a default component.");
  }

  const { clientLoader, clientAction, default: Component, ...rest } = module;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import("./routes/landing").then(convert(queryClient)),
    },
    {
      path: paths.leads.path,
      lazy: () => import("./routes/leads").then(convert(queryClient)),
    },
    {
      path: paths.leadDetails.path,
      lazy: () => import("./routes/lead-detail").then(convert(queryClient)),
    },
    {
      path: "*",
      lazy: () => import("./routes/not-found").then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};
