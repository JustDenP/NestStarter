import { IErrorResponse } from '@common/@types/interfaces/error-response.interface';
import { HelperService } from '@common/helpers/helpers';
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

    /* Get default code and messages from exception */
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException ? exception.message : STATUS_CODES[statusCode];

    /* If this is validation error, we provide additional info about whats wrong */
    let errors: ValidationError[] | undefined;

    if (exception instanceof UnprocessableEntityException) {
      const res: any = exception.getResponse();

      if (res.message) {
        errors = res.message;
      }
    }

    /**
     * Error response generation
     */
    const ErrorResponse: IErrorResponse = {
      statusCode,
      message,
      errors,
      details: {
        path: request.url,
        timestamp: new Date().toISOString(),
        method: request.method,
      },
    };

    response.status(statusCode).json(ErrorResponse);
  }
}
