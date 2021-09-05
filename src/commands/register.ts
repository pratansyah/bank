import 'colors';
import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserRepo from '../repositories/userRepo';
import * as userUtil from '../utils/user';

export default async () => {
  if (userUtil.isLoggedIn()) {
    console.log('Please log out before registering a new account');
    return;
  }
  const userRepo = await getCustomRepository(UserRepo);
  const username = await userUtil.getUsername(userRepo);
  const name = userUtil.getFullName();
  const password = bcrypt.hashSync(userUtil.getPassword(), bcrypt.genSaltSync(10));

  await userRepo.save({
    fullName: name,
    username,
    password,
  });
  let thanks = '\nYour registration is successfull, here is your info:\n';
  thanks += `${'Username: '.green + username}\n`;
  thanks += `${'Full name: '.green + name}\n`;
  console.log(thanks);
};
