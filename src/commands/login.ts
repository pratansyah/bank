import 'colors';
import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserRepo from '../repositories/userRepo';
import DebtRepo from '../repositories/debtRepo';
import * as userUtil from '../utils/user';
import * as debtUtil from '../utils/debt';

export default async (params: string[]) => {
  if (params.length < 1) {
    return ['Please input username'];
  }
  const result = [];
  const username = params[0];
  const password = userUtil.getPassword();
  const userRepo = getCustomRepository(UserRepo);
  const debtRepo = getCustomRepository(DebtRepo);
  const user = await userRepo.getOne({ where: { username } });
  const debts = await debtRepo.getDebts(user);
  if (!user) {
    return ['We can not find that username, please try again'];
  }
  const matchPassword = bcrypt.compareSync(password, user.password);
  if (matchPassword) {
    global.user = user;
    result.push(`Hello ${user.username}`);
    result.push(`Your balance is $${user.balance}`);
    result.push(...debtUtil.list(debts));
  } else {
    return ['Wrong password'];
  }
  return result;
};
