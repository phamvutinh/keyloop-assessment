import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("combines string, array, and conditional class names", () => {
    const isHidden = false;

    expect(
      cn(
        "base",
        ["nested", isHidden && "hidden"],
        { active: true, disabled: false },
        undefined,
      ),
    ).toBe("base nested active");
  });
});
