import { ParamID } from '@common/@types/dtos/one-param-types.dto';
import { PageDTO } from '@common/database/types/page.dto';
import { PageOptionsDTO } from '@common/database/types/page-options.dto';
import { User } from '@entities';
import { _Controller } from '@modules/auth/decorators/auth-controller.decorator';
import { Body, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import { UpdateUserDTO } from './dto/update.dto';
import { UserService } from './user.service';

@_Controller('users', true)
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

  @Patch(':id')
  async update(@Param() params: ParamID, @Body() inputData: UpdateUserDTO) {
    const user = await this.userService._update(params.id, inputData);

    return user.toDTO();
  }

  @Delete(':id')
  async softDelete(@Param() params: ParamID) {
    return this.userService._softDelete(params.id);
  }

  @Patch('/restore/:id')
  async restore(@Param() params: ParamID) {
    const user = await this.userService._restore(params.id);

    return user.toDTO();
  }

  @Delete('/permanent/:id')
  async delete(@Param() params: ParamID) {
    const user = await this.userService._delete(params.id);

    return user.toDTO();
  }
}
