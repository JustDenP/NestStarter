import { User } from '@entities';
import type { Request } from 'express';

interface IRequestWithUser extends Request {
  user: User;
}

export default IRequestWithUser;
