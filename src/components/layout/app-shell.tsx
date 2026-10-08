import {
  ArrowLeftIcon,
  ChartBarIcon,
  ChevronDownIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import type { ComponentType, ReactNode, SVGProps } from "react";

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

export const AppShell = ({ children, current, detailName }: AppShellProps) => {
  return (
    <div className="app-frame">
      <aside className="sidebar" aria-label="Primary navigation">
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
        <nav>
          <section className="nav-section" aria-label="Overview">
            <div className="nav-heading">
              <span>Overview</span>
              <Icon icon={ChevronDownIcon} />
            </div>
            <ul className="nav-list">
              <li>
                <Link className="nav-link" to={paths.leads.path}>
                  <Icon icon={Squares2X2Icon} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link className="nav-link" to={paths.leads.path}>
                  <Icon icon={InboxIcon} />
                  <span>Inbox</span>
                </Link>
              </li>
              <li>
                <Link
                  className="nav-link"
                  to={paths.leads.path}
                  aria-current="page"
                >
                  <Icon icon={UsersIcon} />
                  <span>Manage Leads</span>
                </Link>
              </li>
            </ul>
          </section>
          <section className="nav-section" aria-label="Tools">
            <div className="nav-heading">
              <span>Tools</span>
              <Icon icon={ChevronDownIcon} />
            </div>
            <ul className="nav-list">
              <li>
                <Link className="nav-link" to={paths.leads.path}>
                  <Icon icon={ChartBarIcon} />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link className="nav-link" to={paths.leads.path}>
                  <Icon icon={QuestionMarkCircleIcon} />
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </section>
        </nav>
        <div className="sidebar-bottom">
          <div className="profile">
            <span className="profile-avatar" aria-hidden="true">
              D
            </span>
            <span>
              <span className="profile-name">David</span>
              <span className="profile-role">Admin</span>
            </span>
          </div>
        </div>
      </aside>

      <main className="main" id="top">
        <header className="topbar">
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
  );
};
