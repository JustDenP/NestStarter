import { TokenService } from '@modules/token/token.service';
import { Body, Controller, DefaultValuePipe, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Otp } from 'entities/otp.entity';

import { AuthService } from './auth.service';
import { SendOtpDTO } from './dto/otp.dto';
import { RefreshTokenDTO } from './dto/req-refresh-token.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { AuthenticationResponse } from './types/auth-response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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

  @Post('forgot/send-opt')
  async forgotPassword(@Body() dto: SendOtpDTO): Promise<string> {
    const opt = await this.authService.sendOtp(dto);

    return opt.otpCode;
  }

  // @Auth()
  // @ApiOperation({ summary: 'Logout user' })
  // @Post('logout')
  // logout(
  //   // @LoggedInUser() user: User,
  //   @Query('from_all', new DefaultValuePipe(false), ParseBoolPipe) fromAll: boolean,
  //   @Body() refreshToken?: RefreshTokenDTO,
  // ): Promise<User> {
  //   return fromAll
  //     ? this.authService.logoutFromAll(user)
  //     : this.authService.logout(user, refreshToken.refreshToken);
  // }
}
