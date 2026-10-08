import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/errors";

type ApiErrorProps = {
  error: unknown;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const ApiError = ({
  error,
  title = "Unable to load data",
  action,
}: ApiErrorProps) => {
  return (
    <div
      role="alert"
      className="rounded-card border border-alert bg-alert-soft p-4 text-primary"
    >
      <p className="mb-1 font-semibold">{title}</p>
      <p className="mb-0 text-secondary">{getApiErrorMessage(error)}</p>

      {action ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="mt-4 border-alert text-alert"
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
};
