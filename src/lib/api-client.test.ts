import { afterEach, describe, expect, it, vi } from "vitest";

import { api, ApiError } from "@/lib/api-client";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const mockRequest = () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const logger = vi.spyOn(console, "info").mockImplementation(() => {});
  return { fetchMock, logger };
};

describe("API request logging", () => {
  it("logs successful writes without IDs, query values, or activity content", async () => {
    const { fetchMock, logger } = mockRequest();
    fetchMock.mockResolvedValue(
      Response.json({ id: "private-id" }, { status: 201 }),
    );

    await expect(
      api.post(
        "/leads/private-id/activities",
        { note: "private note" },
        {
          params: { search: "private name" },
        },
      ),
    ).resolves.toEqual({ id: "private-id" });

    expect(logger).toHaveBeenCalledExactlyOnceWith("api.request", {
      method: "POST",
      route: "/leads/:leadId/activities",
      status: 201,
      durationMs: expect.any(Number),
    });
    expect(JSON.stringify(logger.mock.calls)).not.toMatch(/private/);
  });

  it.each([
    ["/leads", "/leads"],
    ["/leads/private-id", "/leads/:leadId"],
    [
      "https://example.test/api/leads/private-id?search=secret",
      "/leads/:leadId",
    ],
    ["/unknown/private-id", "/other"],
  ])("normalizes the route for %s", async (endpoint, route) => {
    const { fetchMock, logger } = mockRequest();
    fetchMock.mockResolvedValue(Response.json({}));

    await api.get(endpoint);

    expect(logger).toHaveBeenCalledWith("api.request", {
      method: "GET",
      route,
      status: 200,
      durationMs: expect.any(Number),
    });
  });

  it("logs HTTP failures while preserving ApiError behavior", async () => {
    const { fetchMock, logger } = mockRequest();
    fetchMock.mockResolvedValue(
      Response.json({ message: "Save failed" }, { status: 500 }),
    );

    await expect(
      api.post("/leads/private-id/activities", {}),
    ).rejects.toBeInstanceOf(ApiError);
    expect(logger).toHaveBeenCalledWith(
      "api.request",
      expect.objectContaining({ status: 500 }),
    );
  });

  it("logs network failures with no HTTP status and preserves the error", async () => {
    const { fetchMock, logger } = mockRequest();
    const error = new TypeError("Network unavailable");
    fetchMock.mockRejectedValue(error);

    await expect(api.get("/leads")).rejects.toBe(error);
    expect(logger).toHaveBeenCalledWith("api.request", {
      method: "GET",
      route: "/leads",
      status: null,
      durationMs: expect.any(Number),
    });
  });
});
