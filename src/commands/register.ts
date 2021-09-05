import 'colors';
import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserRepo from '../repositories/userRepo';
import * as userUtil from '../utils/user';

export default async () => {
  if (userUtil.isLoggedIn()) {
    return ['Please log out before registering a new account'];
  }
  const result = [];
  const userRepo = await getCustomRepository(UserRepo);
  const username = await userUtil.getUsername(userRepo);
  const rawPass = userUtil.getPassword();
  const password = bcrypt.hashSync(rawPass, bcrypt.genSaltSync(10));

  await userRepo.save({
    username,
    password,
  });
  result.push('Your registration is successfull, here is your info:');
  result.push(`${'Username: '.green + username}`);
  return result;
};
