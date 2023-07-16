import { User } from '@entities';
import { TokenService } from '@modules/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpCode,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthUser } from './decorators/auth-user.decorator';
import { EmailDTO } from './dto/otp.dto';
import { RefreshTokenDTO } from './dto/req-refresh-token.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { AuthenticationResponse } from './types/auth-response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @HttpCode(201)
  @Post('register')
  async register(@Body() data: RegisterUserDTO) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  login(@Body() credentials: UserLoginDTO): Promise<AuthenticationResponse> {
    return this.authService.login(credentials);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Post('token/refresh')
  async refresh(@Body() body: RefreshTokenDTO): Promise<any> {
    const token = await this.tokenService.createAccessTokenFromRefreshToken(body.refreshToken);

    return { token };
  }

  @ApiOperation({ summary: 'Send OTP code' })
  @Throttle(1, 180)
  @Post('forgot/send-opt')
  async sendOtp(@Body() body: EmailDTO): Promise<string> {
    const opt = await this.authService.sendOtp(body);

    return opt.otpCode;
  }

  @ApiOperation({ summary: 'Reset password' })
  @Throttle(5, 180)
  @Post('forgot/password-reset')
  resetUserPassword(@Body() body: ResetPasswordDTO): Promise<User> {
    return this.authService.resetPassword(body);
  }

  @ApiOperation({ summary: 'Logout user' })
  @Auth()
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
