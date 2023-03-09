import { User } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> {
  constructor () {
    super(User);
  }
}
