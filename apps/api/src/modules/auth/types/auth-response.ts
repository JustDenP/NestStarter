export class AuthenticationResponse {
  /**
   * @example 1
   */
  user: {
    id: number;
  };

  /**
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXKYjj.eyJ
   */
  accessToken: string;

  /**
   * @example eyJh3d06e6e3e152ae839a6623c3cb6f961a.eyJ
   */
  refreshToken?: string;
}
