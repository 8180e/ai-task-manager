class HttpError extends Error {
  public readonly statusCode: number | undefined;
  public constructor(public readonly message: string) {
    super(message);
  }
}

class BadRequestError extends HttpError {
  public readonly statusCode: number;
  public constructor(public readonly message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends HttpError {
  public readonly statusCode: number;
  public constructor(public readonly message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ForbiddenError extends HttpError {
  public readonly statusCode: number;
  public constructor(public readonly message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class NotFoundError extends HttpError {
  public readonly statusCode: number;
  public constructor(public readonly message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ConflictError extends HttpError {
  public readonly statusCode: number;
  public constructor(public readonly message: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
