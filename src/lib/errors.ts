import { ApiError } from "./api-client";

type ApiErrorData = {
  message?: string;
  errors?: Record<string, string[]>;
};

const isApiErrorData = (data: unknown): data is ApiErrorData => {
  return typeof data === "object" && data !== null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (error instanceof ApiError) {
    if (isApiErrorData(error.data) && typeof error.data.message === "string") {
      return error.data.message;
    }

    switch (error.status) {
      case 401:
        return "Your session has expired. Please sign in again.";

      case 403:
        return "You do not have permission to perform this action.";

      case 404:
        return "The requested record could not be found.";

      default:
        return error.status >= 500
          ? "The server is unavailable. Please try again shortly."
          : error.message || fallback;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
