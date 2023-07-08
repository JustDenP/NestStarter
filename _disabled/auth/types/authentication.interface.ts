export interface IAuthenticationResponse {
  user: {
    idx: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface IOauthResponse {
  email: string;
  firstName?: string;
  lastName?: string;
  accessToken: string;
}

export interface IJwtPayload {
  sub: number;
  roles?: string[];
}
