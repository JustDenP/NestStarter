import { Roles } from '@common/@types/enums/roles.enum';

/**
 * Token payload interfaces
 */

export interface ITokenPayload {
  roles: Roles[];
}

// export interface IAccessTokenPayload {
//   sub: number;
//   roles: Roles[];
//   // type: TokenType.ACCESS_TOKEN | string;
// }

// export interface IRefreshTokenPayload {
//   sub: number;
//   // type: TokenType.REFRESH_TOKEN | string;
// }
