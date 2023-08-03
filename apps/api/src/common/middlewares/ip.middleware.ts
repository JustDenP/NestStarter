import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import * as requestIp from 'request-ip';

@Injectable()
export class RealIpMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    request['realIp'] = requestIp.getClientIp(request);

    next();
  }
}
