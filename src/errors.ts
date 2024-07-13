/**
 * Custom error class for pCloud API errors.
 */
export class PCloudError extends Error {
  public code: number;

  constructor(result: number, error: string) {
    super(`[${result}] ${error}`);
    this.name = "PCloudError";
    this.code = result;
  }
}
