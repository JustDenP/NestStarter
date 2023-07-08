import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import * as requestIp from 'request-ip';

@Injectable()
export class RealIpMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(request: Request, _response: Response, next: NextFunction): void {
    const clientIp = requestIp.getClientIp(request);
    if (clientIp) request.clientIp = clientIp;

    const { method, originalUrl } = request;

    _response.on('finish', () => {
      const msg = `${clientIp} ${method} ${originalUrl}`;
      this.logger.log(msg);
    });

    next();
  }
}
