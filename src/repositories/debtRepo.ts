import {
  EntityRepository,
} from 'typeorm';
import User from '../entities/user';
import Debt from '../entities/debt';
import RepoBase from './repoBase';

@EntityRepository(Debt)
export default class UserRepo extends RepoBase<Debt> {
  async getDebts(user: User) {
    const debts = await this.get({
      where: {
        debtor: user,
      },
      relations: ['debtor', 'creditor'],
      order: {
        id: 'ASC',
      },
    });
    return debts;
  }
}
