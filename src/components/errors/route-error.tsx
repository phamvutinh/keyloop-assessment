import { isRouteErrorResponse, useRouteError } from "react-router";

import { paths } from "@/config/paths";
import { getApiErrorMessage } from "@/lib/errors";

export const RouteError = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText || "The requested page could not be loaded."
    : getApiErrorMessage(error, "An unexpected application error occurred.");

  return (
    <main className="min-h-svh bg-page px-4 py-6 text-primary sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-frame border border-border bg-surface p-6 shadow-frame">
        <p className="mb-2 text-sm font-medium text-alert">Error</p>
        <h1>Something went wrong</h1>
        <p className="text-secondary">{message}</p>
        <a href={paths.leads.path} className="font-medium">
          Back to leads
        </a>
      </section>
    </main>
  );
};
