import * as rl from 'readline-sync';
import { Repository } from 'typeorm';
import User from '../entities/user';

declare const global: { user: User };

export const isLoggedIn = (): boolean => {
  const { user } = global;
  if (user) return true;
  return false;
};

export const getUser = (): User => global.user;

export const refreshUser = async (userRepo: Repository<User>, id): Promise<any> => {
  global.user = await userRepo.findOne({
    where: { id },
  });
  return global.user;
};

export const getUsername = async (userRepo: Repository<User>) => {
  const username = rl.question('What is your username: ');
  if (!username) return getUsername(userRepo);
  const user = await userRepo.findOne({ username });
  if (user) {
    return false;
  }
  return username;
};

export const getPassword = () => {
  const password = rl.question('Type your password: ', { hideEchoBack: true });
  if (!password) return getPassword();
  return password;
};

export const getBalance = (user: User) => `Your balance is: ${`$${user.balance}`.green}`;
