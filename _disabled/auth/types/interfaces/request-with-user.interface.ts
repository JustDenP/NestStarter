import { User } from '@local/shared-models';
import type { Request } from 'express';

interface IRequestWithUser extends Request {
  user: User;
}

export default IRequestWithUser;
