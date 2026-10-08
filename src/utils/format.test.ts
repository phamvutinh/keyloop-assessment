import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate, formatPercent } from "./format";

describe("format utilities", () => {
  it("formats dates for the UK locale", () => {
    expect(formatDate("2024-01-02T12:00:00Z")).toBe("2 Jan 2024");
  });

  it("formats whole-pound currency values", () => {
    expect(formatCurrency(1200)).toBe("£1,200");
  });

  it("rounds percentage values", () => {
    expect(formatPercent(67.6)).toBe("68%");
  });
});
