type QueryValue = string | number | boolean | null | undefined;

type ApiClientOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, QueryValue | QueryValue[]>;
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const buildUrl = (endpoint: string, params?: ApiClientOptions["params"]) => {
  const baseUrl = isAbsoluteUrl(endpoint)
    ? endpoint
    : `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  const url = new URL(baseUrl, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];

      values.forEach((item) => {
        if (item !== undefined && item !== null) {
          url.searchParams.append(key, String(item));
        }
      });
    });
  }

  return url.toString();
};

const parseResponse = async (response: Response) => {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const getErrorMessage = (data: unknown, fallback: string) => {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = data.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
};

const getRouteTemplate = (url: string) => {
  const path = new URL(url).pathname;
  if (/\/leads$/.test(path)) return "/leads";
  if (/\/leads\/[^/]+\/activities$/.test(path))
    return "/leads/:leadId/activities";
  if (/\/leads\/[^/]+$/.test(path)) return "/leads/:leadId";
  return "/other";
};

const request = async <TResponse>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<TResponse> => {
  const { body, headers, params, ...init } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const url = buildUrl(endpoint, params);
  const startedAt = performance.now();
  let status: number | null = null;

  try {
    const response = await fetch(url, {
      credentials: "include",
      ...init,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    status = response.status;
    const data = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(data, response.statusText),
        response.status,
        data,
      );
    }

    return data as TResponse;
  } finally {
    console.info("api.request", {
      method: init.method ?? "GET",
      route: getRouteTemplate(url),
      status,
      durationMs: Math.round(performance.now() - startedAt),
    });
  }
};

export const api = {
  get: <TResponse>(endpoint: string, options?: ApiClientOptions) =>
    request<TResponse>(endpoint, { ...options, method: "GET" }),
  post: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiClientOptions,
  ) => request<TResponse>(endpoint, { ...options, method: "POST", body }),
  put: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiClientOptions,
  ) => request<TResponse>(endpoint, { ...options, method: "PUT", body }),
  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiClientOptions,
  ) => request<TResponse>(endpoint, { ...options, method: "PATCH", body }),
  delete: <TResponse>(endpoint: string, options?: ApiClientOptions) =>
    request<TResponse>(endpoint, { ...options, method: "DELETE" }),
};
