import { Roles } from '@local/shared-types';

import { TokenType } from '../constants/token-type.enum';
/**
 * Token payload interfaces
 */

export interface IAccessTokenPayload {
  sub: number;
  roles: Roles[];
  type: TokenType.ACCESS_TOKEN | string;
}

export interface IRefreshTokenPayload {
  sub: number;
  type: TokenType.REFRESH_TOKEN | string;
}
