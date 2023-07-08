import { STATUS_CODES } from 'node:http';

import { IErrorResponse } from '@common/@types/interfaces/error-response.interface';
import { ServerException, UniqueConstraintViolationException } from '@mikro-orm/core';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(ServerException)
export class QueryFailedFilter implements ExceptionFilter {
  catch(
    exception: UniqueConstraintViolationException & { constraint?: string; detail?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception.name && exception.name.startsWith('Unique')
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = STATUS_CODES[statusCode];
    let errors;

    if (exception?.constraint) {
      const constraint = exception.constraint;
      const detail = exception.detail;

      errors = {
        constraint,
        detail,
      };
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
