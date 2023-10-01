import type { Request, Response, NextFunction } from 'express';
import { AppError , ValidationError} from '../errors';

export default function responseError(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  
  if(error instanceof ValidationError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      issues: error.issues
    })
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }


  console.error('Internal server error', error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}