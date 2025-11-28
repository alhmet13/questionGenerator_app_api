declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  }
}

export class AppError extends Error {
  isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
