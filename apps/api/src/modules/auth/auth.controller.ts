import { User } from '@entities';
import { TokenService } from '@modules/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import {
  Body,
  DefaultValuePipe,
  HttpCode,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { _Controller } from './decorators/auth-controller.decorator';
import { AuthUser } from './decorators/auth-user.decorator';
import { RefreshTokenDTO } from './dto/req-refresh-token.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import IRequestWithUser from './types/interfaces/request-with-user.interface';

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

  @HttpCode(200)
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  // OLD Promise<AuthenticationResponse>
  async login(@Body() credentials: UserLoginDTO, @Res({ passthrough: true }) response: Response) {
    const [user, accessToken, refreshToken] = await this.authService.login(credentials);
    delete user.password;

    const refreshCookie = this.authService.createCookieToken(refreshToken, 'Refresh');
    response.setHeader('Set-Cookie', [refreshCookie]);

    return { user, accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh token' })
  @Post('token/refresh')
  async refresh(@AuthUser() user: User, @Res({ passthrough: true }) response: Response) {
    const accessToken = await this.tokenService.generateAccessToken(user);
    const accessCookie = this.authService.createCookieToken(accessToken, 'Authentication');

    response.setHeader('Set-Cookie', accessCookie);

    return user;
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
