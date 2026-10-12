import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

export const Modal = ({ children, isOpen, title, onClose }: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    previousFocusRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      open
      className="fixed w-screen h-screen inset-0 z-50 grid place-items-center bg-primary/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="w-[min(480px,calc(100%_-_32px))] max-h-[min(90vh,760px)] overflow-auto rounded-card border border-border bg-white p-0 text-primary shadow-[0_24px_70px_rgb(0_0_0_/_20%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between gap-4 border-b border-b-border border-solid px-5 py-[18px]">
          <h2 id={titleId}>{title}</h2>
          <button
            className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[50%] border border-solid border-border bg-white text-primary hover:border-border-strong hover:bg-page"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-3.5 pt-[19px] pb-5 px-5">{children}</div>
      </section>
    </dialog>
  );
};
