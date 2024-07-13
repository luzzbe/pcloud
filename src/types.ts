export type ApiResponse = ApiResult | ApiError;
export type ApiError = { result: number; error: string };
export type ApiResult = { result: 0; [key: string]: any };
