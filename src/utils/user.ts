import * as rl from 'readline-sync';
import { Repository } from 'typeorm';
import User from '../entities/user';

declare const global: { user: User };

export function isLoggedIn(): boolean {
  const { user } = global;
  if (user) return true;
  return false;
}

export function getUser(): User {
  return global.user;
}

export async function refreshUser(userRepo: Repository<User>, id): Promise<any> {
  global.user = await userRepo.findOne({
    where: { id },
  });
}

export async function getUsername(userRepo: Repository<User>) {
  const username = rl.question('What is your username: ');
  if (!username) return getUsername(userRepo);
  const user = await userRepo.findOne({ username });
  if (user) {
    console.log('That username is already taken, please type another one'.red);
    return getUsername(userRepo);
  }
  return username;
}

export function getFullName() {
  const fullName = rl.question('What is your full name: ');
  if (!fullName) return getFullName();
  return fullName;
}

export function getPassword() {
  const password = rl.question('Type your password: ', { hideEchoBack: true });
  if (!password) return getPassword();
  return password;
}
