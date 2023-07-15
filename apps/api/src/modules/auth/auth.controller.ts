import { Roles } from '@common/@types/enums/roles.enum';
import { User } from '@entities';
import { TokenService } from '@modules/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthUser } from './decorators/auth-user.decorator';
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
  @Post('forgot/send-opt')
  async sendOtp(@Body() body: SendOtpDTO): Promise<string> {
    const opt = await this.authService.sendOtp(body);

    return opt.otpCode;
  }

  @Auth([Roles.CLIENT])
  @Get('test')
  test(@AuthUser() userFromPayload: User) {
    return userFromPayload;
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
