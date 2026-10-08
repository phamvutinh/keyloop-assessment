import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders an accessible button with its label", () => {
    render(<Button>Save follow-up</Button>);

    expect(
      screen.getByRole("button", { name: "Save follow-up" }),
    ).toBeInTheDocument();
  });

  it("calls the click handler when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction while loading without changing its accessible label", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button isLoading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders an icon without changing the accessible label", () => {
    render(<Button icon={<ArrowLeftIcon aria-hidden="true" />}>Back</Button>);

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("can render from a label prop", () => {
    render(<Button label="Create lead" />);

    expect(
      screen.getByRole("button", { name: "Create lead" }),
    ).toBeInTheDocument();
  });

  it("renders an icon-only button using label as the accessible name", () => {
    render(
      <Button
        label="Back"
        icon={<ArrowLeftIcon aria-hidden="true" />}
        isIconOnly
      />,
    );

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("can apply button styling to a child link", () => {
    render(
      <Button
        asChild
        variant="secondary"
        icon={<ArrowLeftIcon aria-hidden="true" />}
      >
        <a href="/leads">Back to leads</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Back to leads" })).toHaveAttribute(
      "href",
      "/leads",
    );
  });

  it("shows pending state while an async click action is running", async () => {
    const user = userEvent.setup();
    let resolveAction: () => void = () => undefined;
    const clickAction = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<Button clickAction={clickAction}>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(clickAction).toHaveBeenCalledTimes(1);

    resolveAction();
  });
});
