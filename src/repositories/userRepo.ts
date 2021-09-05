import {
  EntityRepository,
} from 'typeorm';
import User from '../entities/user';
import RepoBase from './repoBase';

@EntityRepository(User)
export default class UserRepo extends RepoBase<User> {

}
