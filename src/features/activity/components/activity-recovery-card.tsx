import { useState } from "react";

import { ApiError } from "@/components/errors/api-error";
import { Button } from "@/components/ui/button";
import { resetStoredActivities } from "@/features/activity/storage";

type ActivityRecoveryCardProps = {
  error: unknown;
  onRetry: () => void;
};

export const ActivityRecoveryCard = ({
  error,
  onRetry,
}: ActivityRecoveryCardProps) => {
  const [resetError, setResetError] = useState("");

  return (
    <div
      className="grid min-w-0 gap-[14px] rounded-2xl border border-border bg-surface p-[22px] shadow-card [&_p]:m-0 [&_p]:leading-[1.6] [&_p]:text-secondary"
      role="alert"
    >
      <ApiError
        error={error}
        title="Unable to load saved follow-up history"
        action={{
          label: "Try again",
          onClick: onRetry,
        }}
      />
      <p>
        Saved Follow-up data in this browser may be unreadable or use an
        unsupported format. You can remove locally saved activities for this
        demo and return to the seeded sample history.
      </p>
      <p>
        This recovery action removes locally saved Follow-up notes from this
        browser before reloading the lead details.
      </p>
      {resetError ? (
        <p className="m-0 leading-normal text-alert">{resetError}</p>
      ) : null}
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => {
          setResetError("");
          try {
            resetStoredActivities();
            onRetry();
          } catch (error) {
            setResetError(
              error instanceof Error
                ? error.message
                : "Unable to remove locally saved Follow-up notes. Try again.",
            );
          }
        }}
      >
        Remove locally saved Follow-ups
      </Button>
    </div>
  );
};
