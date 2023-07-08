import { LoginUserDTO } from '@api/modules/app/user/dto/sign/user-login.dto';
import { RegisterUserLocalDTO } from '@api/modules/app/user/dto/sign/user-register.dto';
import { User } from '@local/shared-models';
import { Roles } from '@local/shared-types';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthUser } from './decorators/auth-user.decorator';
import { GoogleOauthGuard } from './guards/google-authentication.guard';
import JwtRefreshGuard from './guards/jwt-authentication-refresh.guard';
import { AuthenticationStrategyType } from './types/constants/authentication-strategy-type.enum';
import { TokenType } from './types/constants/token-type.enum';

/******************************
 * * Reminder to return only DTO in controllers
 ******************************/

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register user
   * @param userData
   * @returns registred user
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() userData: RegisterUserLocalDTO) {
    const userEntity = await this.authService.register(userData);

    return userEntity.toDTO();
  }

  /**
   * Login user
   * @param requests
   * @param response
   * @returns Logged in user
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() inputData: LoginUserDTO) {
    const loginData = await this.authService.signIn(AuthenticationStrategyType.PLAIN, inputData);

    return {
      user: loginData.user.toDTO(),
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    };
  }

  /**
   * Refresh access token
   * @param user User from request
   * @returns Access token
   */
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@AuthUser() user: User) {
    const accessToken = await this.authService.createToken(user, TokenType.ACCESS_TOKEN);

    return accessToken;
  }

  @Get('me')
  @Auth([Roles.CLIENT, Roles.ADMIN])
  async me(@AuthUser() userFromPayload: User) {
    const user = await this.authService.userService.findById(userFromPayload.id);

    return user.toDTO();
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // Silence is golden...
  }

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@AuthUser() user: User) {
    return {
      user,
      accessToken: await this.authService.createToken(user, TokenType.ACCESS_TOKEN),
      refreshToken: await this.authService.createToken(user, TokenType.REFRESH_TOKEN),
    };
  }
}
