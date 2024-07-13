import { ApiError, ApiResponse } from "./types";

export function isApiError(response: ApiResponse): response is ApiError {
  return response.result !== 0;
}
