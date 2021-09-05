import 'colors';
import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserRepo from '../repositories/userRepo';
import DebtRepo from '../repositories/debtRepo';
import * as userUtil from '../utils/user';
import * as debtUtil from '../utils/debt';

export default async (params: string[]) => {
  if (params.length < 1) {
    console.log('Please input username');
    return;
  }
  const username = params[0];
  const password = userUtil.getPassword();
  const userRepo = getCustomRepository(UserRepo);
  const debtRepo = getCustomRepository(DebtRepo);
  const user = await userRepo.getOne({ where: { username } });
  const debts = await debtRepo.getDebts(user);
  if (!user) {
    console.log('We can not find that username, please try again');
  } else {
    const matchPassword = bcrypt.compareSync(password, user.password);
    if (matchPassword) {
      global.user = user;
      console.log('Hello,', user.fullName);
      console.log('Your balance is', user.balance);
      debtUtil.list(debts);
    } else {
      console.log('Wrong password');
    }
  }
};
