import { Roles } from '@common/@types/enums/roles.enum';
import { PageDTO } from '@common/database/types/page.dto';
import { PageOptionsDTO } from '@common/database/types/page-options.dto';
import { User } from '@entities';
import { RequiredEntityData } from '@mikro-orm/core/typings';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { BaseService } from '@modules/@lib/base/base.service';
import { Injectable } from '@nestjs/common';

import { RegisterUserLocalDTO, RegisterUserOAuthDTO } from './dto/sign/user-register.dto';

/**
 * If the request URI indicates the location of a single resource, we use 404 Not found.
 * When the request queries a URI, we use 204 No Content
 * http://mywebsite/api/user/13 would return 404 when user 13 does not exist
 * http://mywebsite/api/users?id=13 would return 204 no content
 * http://mywebsite/api/users?firstname=test would return 204 no content
 */

@Injectable()
export class UserService extends BaseService<User> {
  protected readonly queryName = 'User'; // the name of the query used in the pagination

  constructor(
    @InjectRepository(User)
    private userRepository: BaseRepository<User>,
    private readonly em: EntityManager,
  ) {
    super(userRepository, em);
  }

  async getPaginated(pageOptionsDTO: PageOptionsDTO): Promise<PageDTO<User>> {
    const qb = this.userRepository.createQueryBuilder(this.queryName);

    return this.userRepository.paginate(
      { pageOptionsDTO, qb },
      // { fields: ['username', 'email'], relations: [] },
    );
  }

  /**
   * Register new user
   * @param data {@link RegisterUserLocalDTO} {@link RegisterUserOAuthDTO}
   * @returns User
   */
  public register(data: RegisterUserLocalDTO | RegisterUserOAuthDTO) {
    const user: RequiredEntityData<User> = {
      ...data,
      roles: [Roles.CLIENT],
      isActive: true,
    };

    const newUser = this.userRepository.create(user);
    this.em.persistAndFlush(newUser);

    return this.userRepository.findOne(newUser);
  }
}
