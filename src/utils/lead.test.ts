import { describe, expect, it } from "vitest";

import { getInitials, getInquiryExcerpt } from "./lead";

describe("lead utilities", () => {
  it("builds initials from the first two name parts", () => {
    expect(getInitials("Anna Reed")).toBe("AR");
    expect(getInitials("  Priya  Shah Patel  ")).toBe("PS");
  });

  it("keeps short inquiry messages unchanged", () => {
    expect(getInquiryExcerpt("Short message")).toBe("Short message");
  });

  it("truncates long inquiry messages with an ellipsis", () => {
    const message = `${"a".repeat(117)} trailing text`;

    expect(getInquiryExcerpt(message)).toBe(`${"a".repeat(117)}…`);
  });
});
