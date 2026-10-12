import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { ComponentType, ReactNode, SVGProps } from "react";

import { Modal } from "@/components/ui/modal";
import { paths } from "@/config/paths";

type AppShellProps = {
  children: ReactNode;
  current: string;
  detailName?: string;
};

type OutlineIcon = ComponentType<SVGProps<SVGSVGElement>>;

const Icon = ({ icon: IconComponent }: { icon: OutlineIcon }) => (
  <IconComponent className="hero-icon" aria-hidden="true" />
);

const isEditableTarget = (target: EventTarget | null) => {
  return target instanceof HTMLElement
    ? Boolean(target.closest("input, textarea, select, [contenteditable]"))
    : false;
};

export const AppShell = ({ children, current, detailName }: AppShellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }

      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      setIsModalOpen(true);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="app-frame w-full max-w-full">
        <main className="main" id="top">
          <header className="topbar">
            <Link
              className="brand"
              to={paths.leads.path}
              aria-label="AI Manager leads"
            >
              <span className="brand-mark" aria-hidden="true">
                <Icon icon={SparklesIcon} />
              </span>
              <span className="brand-name">AI Manager</span>
            </Link>
            <div className="breadcrumbs">
              <Link
                className="back-button"
                to={paths.leads.path}
                aria-label="Back to leads"
                hidden={!detailName}
              >
                <Icon icon={ArrowLeftIcon} />
              </Link>
              <span>Overview</span>
              <span aria-hidden="true">/</span>
              <strong>{detailName ?? current}</strong>
            </div>
          </header>
          <div className="content">{children}</div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Modal"
        onClose={() => setIsModalOpen(false)}
      >
        <p className="m-0 text-secondary">URL will be added here.</p>
      </Modal>
    </>
  );
};
