import 'colors';
import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserRepo from '../repositories/userRepo';

export default async (params: string[]) => {
  if (params.length < 2) {
    console.log('Please input username and password');
    return;
  }
  const username = params[0];
  const password = params[1];
  const userRepo = getCustomRepository(UserRepo);
  const user = await userRepo.getOne({ where: { username } });
  if (!user) {
    console.log('We can not find that username, please try again');
  } else {
    const matchPassword = bcrypt.compareSync(password, user.password);
    if (matchPassword) {
      global.user = user;
      console.log('Hello,', user.fullName);
    } else {
      console.log('Wrong password');
    }
  }
};
