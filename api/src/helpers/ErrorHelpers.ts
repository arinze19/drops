import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

// Base Error class
class ErrorHandler extends Error {
  statusCode: number;

  constructor(errorMessage: string, statusCode = 500) {
    super(errorMessage);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

// General error handler
const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  const customError: boolean = err.constructor.name === 'NodeError' || err.constructor.name === 'SyntaxError' ? false : true;
  const statusCode = err instanceof AxiosError ? err.response?.status : err.statusCode;
  const message = err instanceof AxiosError ? err.response?.data?.message : 'Sorry, something went wrong';

  res.status(err.statusCode || 500).json({
    response: 'Error',
    error: {
      type: customError === false ? 'UnhandledError' : err.constructor.name,
      path: req.path,
      statusCode: statusCode || 500,
      message: message,
    },
  });

  next();
};

export { ErrorHandler, handleError }
