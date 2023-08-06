import { ParamID } from '@common/@types/dtos/one-param-types.dto';
import { Role } from '@common/@types/enums/roles.enum';
import { PageDTO } from '@common/database/types/page.dto';
import { PageOptionsDTO } from '@common/database/types/page-options.dto';
import { User } from '@entities';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { _Controller } from '@modules/auth/decorators/auth-controller.decorator';
import { Body, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UpdateUserDTO } from './dto/update.dto';
import { UserService } from './user.service';

@_Controller('users', false)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get users paginated' })
  @Get()
  async all(@Query() pageOptionsDTO: PageOptionsDTO): Promise<PageDTO<User>> {
    return await this.userService.getPaginated(pageOptionsDTO);
  }

  @ApiOperation({ summary: 'Find user by ID' })
  @Get(':id')
  async findById(@Param() params: ParamID) {
    const user = await this.userService.findById(params.id, {
      populate: true,
    });

    return user;
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  async update(@Param() params: ParamID, @Body() inputData: UpdateUserDTO) {
    const user = await this.userService.update(params.id, inputData);

    return user;
  }

  @ApiOperation({ summary: 'Soft delete user' })
  @Delete(':id')
  async softDelete(@Param() params: ParamID) {
    return this.userService.softDelete(params.id);
  }

  @ApiOperation({ summary: 'Restore user' })
  @Patch('/restore/:id')
  async restore(@Param() params: ParamID) {
    const user = await this.userService.restore(params.id);

    return user;
  }

  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Permanently delete user' })
  @Delete('/permanent/:id')
  async delete(@Param() params: ParamID) {
    const user = await this.userService.permanentDelete(params.id);

    return user;
  }
}
