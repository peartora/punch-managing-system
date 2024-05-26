export class BusinessError extends Error {
  public code: string;
  public detail: unknown;

  constructor(code: string, message: string, detail?: unknown) {
    super(message);
    this.name = "BusinessError";

    this.code = code;
    this.detail = detail;
  }
}
