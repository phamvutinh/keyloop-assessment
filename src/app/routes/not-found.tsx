import { Link } from "react-router";

import { paths } from "@/config/paths";

const NotFoundRoute = () => {
  return (
    <section className="grid flex-1 place-items-center px-6 py-16 sm:py-20 lg:py-24 min-h-dvh">
      <div className="flex flex-col place-items-center w-full max-w-[520px]">
        <h1 className="mb-0 text-[clamp(84px,18vw,148px)] font-bold leading-[0.95] tracking-[-0.085em] text-primary">
          404
        </h1>
        <h2 className="mb-2.5 mt-[22px] text-[clamp(23px,4vw,30px)] font-semibold leading-tight tracking-[-0.7px]">
          We can’t find that page
        </h2>
        <p className="mx-auto mb-0 max-w-[430px] text-base leading-relaxed text-secondary text-center">
          The link may be outdated, or the page may have moved. Head back to
          your leads to continue where you left off.
        </p>
        <div className="mt-[30px] flex justify-center max-[360px]:mt-6">
          <Link
            to={paths.leads.path}
            className="inline-flex min-h-[46px] items-center justify-center gap-[9px] rounded-full border border-primary bg-primary px-[19px] text-sm font-semibold text-surface no-underline hover:border-accent active:translate-y-px max-[360px]:w-full"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[17px] w-[17px]"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            <span>Back to leads</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundRoute;
