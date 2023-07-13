import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  /**
   * Refresh token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
   */
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
