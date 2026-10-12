import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./modal";

describe("Modal", () => {
  it("renders a visible close icon and closes from the close button", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen title="Add follow-up" onClose={handleClose}>
        <p>Modal content</p>
      </Modal>,
    );

    const closeButton = screen.getByRole("button", { name: "Close modal" });
    const closeIcon = closeButton.querySelector("svg");

    expect(closeIcon).toHaveClass("h-4", "w-4");
    expect(closeButton.querySelector("use")).not.toBeInTheDocument();

    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
