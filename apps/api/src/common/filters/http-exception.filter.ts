import { IErrorResponse } from '@common/@types/interfaces/error-response.interface';
import type { ArgumentsHost, ExceptionFilter, ValidationError } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    /* Get default code and error from exception */
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const error = exception instanceof HttpException ? exception.message : STATUS_CODES[statusCode];

    /* If this is validation error, we provide additional info about whats wrong */
    let message: ValidationError[] | undefined;

    if (exception instanceof UnprocessableEntityException) {
      const res: any = exception.getResponse();

      if (res.message) {
        message = res.message;
      }
    }

    /**
     * Error response generation
     */
    const ErrorResponse: IErrorResponse = {
      statusCode,
      error,
      message,
      details: {
        path: request.url,
        timestamp: new Date().toISOString(),
        method: request.method,
      },
    };

    response.status(statusCode).json(ErrorResponse);
  }
}
