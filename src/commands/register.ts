import 'colors';
import * as rl from 'readline-sync';
import { getCustomRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import User from '../entities/user';
import UserRepo from '../repositories/userRepo';

const getUsername = async (userRepo: Repository<User>) => {
  const username = rl.question('What is your username: ');
  if (!username) return getUsername(userRepo);
  const user = await userRepo.findOne({ username });
  if (user) {
    console.log('That username is already taken, please type another one'.red);
    return getUsername(userRepo);
  }
  return username;
};

const getFullName = () => {
  const fullName = rl.question('What is your full name: ');
  if (!fullName) return getFullName();
  return fullName;
};

const getPassword = () => {
  const password = rl.question('Type your password: ', { hideEchoBack: true });
  if (!password) return getPassword();
  return password;
};

export default async () => {
  if (global.user) {
    console.log('Please log out before registering a new account');
    return;
  }
  const userRepo = await getCustomRepository(UserRepo);
  const username = await getUsername(userRepo);
  const name = getFullName();
  const password = bcrypt.hashSync(getPassword(), bcrypt.genSaltSync(10));

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
