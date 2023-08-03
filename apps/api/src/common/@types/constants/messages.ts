/* eslint-disable max-len */
const common = {
  loginAgain: 'Please login again!',
};

export const Msgs = {
  validation: {},
  exception: {
    tooManyEntitiesRequested: `Too many entities requested.`,
    tokenMalformed: `Token malformed! ${common.loginAgain}`,
    tokenNotFound: `Token not found!. ${common.loginAgain}`,
    tokenRevoked: 'Token revoked!. Please login again!',
    forbidden: `Access Denied. You do not have permission to access this resource.`,
    wrongCredentials: `Invalid email or password. Please check your credentials and try again.`,
    inactiveUser: `Your account has not been activated yet.`,
    sessionExpired: `The session has expired. ${common.loginAgain}`,
    unauthorized: `Unauthorized.`,
    wrongOTP: 'Wrong code.',
    expiredOTP: 'The OTP code has expired. Please request a new code to proceed.',
    waitForNewOTP:
      "Please wait before requesting another OTP code. We have sent a code to your email. If you don't receive it within a few minutes, please check your spam folder.",
  },
};
