import { PageDTO } from '@common/database/types/page.dto';
import { PageOptionsDTO } from '@common/database/types/page-options.dto';
import { User } from '@entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { BaseService } from '@modules/@lib/base/base.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService extends BaseService<User> {
  protected readonly queryName = 'User'; // the name of the query used in the pagination

  constructor(
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
  ) {
    super(userRepository);
  }

  async getPaginated(pageOptionsDTO: PageOptionsDTO): Promise<PageDTO<User>> {
    const qb = this.userRepository.createQueryBuilder(this.queryName);

    return this.userRepository.paginate(
      { pageOptionsDTO, qb },
      /* { fields: ['username', 'email'], relations: [] }, */
    );
  }
}
