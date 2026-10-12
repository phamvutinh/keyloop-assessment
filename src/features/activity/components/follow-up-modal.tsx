import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { activityTypeLabels } from "@/features/activity/constants";
import { activityTypes, type ActivityType } from "@/types/api";

export type FollowUpInput = {
  type: ActivityType;
  note: string;
};

type FollowUpModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  saveError: string;
  onClose: () => void;
  onSubmit: (input: FollowUpInput) => Promise<boolean>;
  onResetSaveError: () => void;
};

export const FollowUpModal = ({
  isOpen,
  isSaving,
  saveError,
  onClose,
  onSubmit,
  onResetSaveError,
}: FollowUpModalProps) => {
  const [note, setNote] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("call");
  const [validationError, setValidationError] = useState("");

  const handleClose = () => {
    setValidationError("");
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onResetSaveError();

    if (!note.trim()) {
      setValidationError("Enter a follow-up note before saving.");
      return;
    }

    setValidationError("");
    const didSave = await onSubmit({ type: activityType, note });

    if (didSave) {
      setNote("");
      setActivityType("call");
    }
  };

  return (
    <Modal isOpen={isOpen} title="Add follow-up" onClose={handleClose}>
      <form
        className="grid gap-3"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <label className="font-semibold text-primary" htmlFor="activityType">
          Activity type
        </label>
        <select
          className="box-border min-h-11 w-full rounded-xl border border-border p-3 text-primary focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent/40"
          id="activityType"
          value={activityType}
          onChange={(event) =>
            setActivityType(event.target.value as ActivityType)
          }
        >
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {activityTypeLabels[type]}
            </option>
          ))}
        </select>

        <label className="font-semibold text-primary" htmlFor="followUpNote">
          Follow-up note
        </label>
        <textarea
          className="box-border min-h-28 w-full resize-y rounded-xl border border-border p-3 text-primary focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent/40"
          id="followUpNote"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            if (validationError) {
              setValidationError("");
            }
          }}
          aria-describedby="followUpFeedback"
          aria-invalid={Boolean(validationError)}
          rows={4}
        />
        <div id="followUpFeedback" aria-live="polite">
          {validationError ? (
            <p className="m-0 leading-normal text-alert">{validationError}</p>
          ) : null}
          {saveError ? (
            <p className="m-0 leading-normal text-alert">
              {saveError} Your note is still here; try saving again.
            </p>
          ) : null}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            Add activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};
