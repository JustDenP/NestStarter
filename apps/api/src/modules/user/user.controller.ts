import { ParamID } from '@common/@types/dtos/one-param-types.dto';
import { PageDTO } from '@common/database/types/page.dto';
import { PageOptionsDTO } from '@common/database/types/page-options.dto';
import { User } from '@entities';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDTO } from './dto/create-user.dto';
import { RegisterUserLocalDTO } from './dto/sign/user-register.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@ApiNotFoundResponse({ description: 'User(s) not found' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async all(@Query() pageOptionsDTO: PageOptionsDTO): Promise<PageDTO<User>> {
    return await this.userService.getPaginated(pageOptionsDTO);
  }

  @Get(':id')
  async findById(@Param() params: ParamID) {
    const user = await this.userService._findOne(params.id, {
      populate: true,
    });

    return user.toDTO();
  }

  @Post('register')
  async register(@Body() data: RegisterUserLocalDTO) {
    return this.userService.register(data);
  }

  @Patch(':id')
  async update(@Param() params: ParamID, @Body() inputData: UpdateUserDTO) {
    const user = await this.userService._update(params.id, inputData);

    return user.toDTO();
  }

  @Delete(':id')
  async delete(@Param() params: ParamID) {
    const user = await this.userService._delete(params.id);

    return user.toDTO();
  }
}
