import {
  EntityRepository, FindManyOptions, FindOneOptions, Repository,
} from 'typeorm';
import User from '../entities/user';

@EntityRepository(User)
export default class UserRepo extends Repository<User> {
  async getOne(params: FindOneOptions) {
    const user = await this.findOne(params);
    return user;
  }

  async get(params: FindManyOptions) {
    const users = await this.find(params);
    return users;
  }
}
