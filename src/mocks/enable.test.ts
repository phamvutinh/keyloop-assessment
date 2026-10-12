import { afterEach, describe, expect, it, vi } from "vitest";

const { start } = vi.hoisted(() => ({
  start: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/mocks/browser", () => ({ worker: { start } }));

import { enableMocking } from "@/mocks/enable";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("demo mock bootstrap", () => {
  it.each([true, false])("starts the worker with DEV=%s", async (dev) => {
    vi.stubEnv("DEV", dev);
    vi.stubEnv("VITE_ENABLE_MOCKING", undefined);

    await enableMocking();

    expect(start).toHaveBeenCalledExactlyOnceWith({
      onUnhandledRequest: "bypass",
    });
  });

  it("allows explicitly disabling mocks for a real API", async () => {
    vi.stubEnv("VITE_ENABLE_MOCKING", "false");

    await enableMocking();

    expect(start).not.toHaveBeenCalled();
  });
});
