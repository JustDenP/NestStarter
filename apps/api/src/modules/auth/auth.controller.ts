import { User } from '@entities';
import { TokenService } from '@modules/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import { Body, DefaultValuePipe, HttpCode, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { _Controller } from './decorators/auth-controller.decorator';
import { AuthUser } from './decorators/auth-user.decorator';
import { EmailDTO } from './dto/otp.dto';
import { RefreshTokenDTO } from './dto/req-refresh-token.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { AuthenticationResponse } from './types/auth-response';

@_Controller('auth', false)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @HttpCode(201)
  @ApiOperation({ summary: 'Register user' })
  @Post('register')
  async register(@Body() data: RegisterUserDTO) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  login(@Body() credentials: UserLoginDTO): Promise<AuthenticationResponse> {
    return this.authService.login(credentials);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Post('token/refresh')
  async refresh(@Body() body: RefreshTokenDTO): Promise<any> {
    const token = await this.tokenService.createAccessTokenFromRefreshToken(body.refreshToken);

    return { token };
  }

  // @Throttle(1, 180)
  @ApiOperation({ summary: 'Send OTP code' })
  @Post('forgot/send-opt')
  async sendOtp(@Body() body: EmailDTO): Promise<string> {
    const opt = await this.authService.sendOtp(body);

    return opt.otpCode;
  }

  @Throttle(5, 180)
  @ApiOperation({ summary: 'Reset password' })
  @Post('forgot/password-reset')
  resetUserPassword(@Body() body: ResetPasswordDTO): Promise<User> {
    return this.authService.resetPassword(body);
  }

  @Auth()
  @ApiOperation({ summary: 'Logout user' })
  @Post('logout')
  async logout(
    @AuthUser() user: User,
    @Query('from_all', new DefaultValuePipe(false), ParseBoolPipe) fromAll: boolean,
    @Body() refreshToken?: RefreshTokenDTO,
  ): Promise<boolean> {
    console.log(fromAll);
    fromAll
      ? await this.authService.logoutFromAll(user)
      : await this.authService.logout(user, refreshToken.refreshToken);

    return true;
  }
}
