import { Msgs } from '@common/@types/constants/messages';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

function commonHandleRequest(error, user, info) {
  if (error || info || !user) {
    if (info instanceof TokenExpiredError) {
      throw new ForbiddenException(Msgs.exception.sessionExpired);
    } else if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(Msgs.exception.tokenMalformed);
    } else {
      throw new UnauthorizedException(Msgs.exception.unauthorized);
    }
  }

  return user;
}

export default commonHandleRequest;
