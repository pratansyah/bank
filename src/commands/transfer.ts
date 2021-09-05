import 'colors';
import { getCustomRepository } from 'typeorm';
import DebtRepo from '../repositories/debtRepo';
import UserRepo from '../repositories/userRepo';
import * as userUtil from '../utils/user';
import * as debtUtil from '../utils/debt';
import { precisionRound } from '../utils/number';

export default async (params: string[]) => {
  if (!userUtil.isLoggedIn()) {
    console.log('You have to log in first');
    return;
  }
  if (params.length < 2) {
    console.log('Please input username destination and amount');
    return;
  }
  const userRepo = getCustomRepository(UserRepo);
  const debtRepo = getCustomRepository(DebtRepo);
  const destUsername = params[0];
  const amount = parseFloat(params[1]);
  if (Number.isNaN(amount)) {
    console.log('You have to input number for the transfer amount');
    return;
  }
  const user = userUtil.getUser();
  const dest = await userRepo.getOne({
    where: { username: destUsername },
  });

  if (!dest) {
    console.log('We can not find that username');
    return;
  }
  let newBalance = 0;
  let debtAmount = 0;
  if (user.balance >= amount) {
    newBalance = precisionRound(user.balance - amount);
  } else {
    debtAmount = precisionRound(Math.abs(user.balance - amount));
    const debt = await debtRepo.getOne({
      where: {
        creditor: {
          username: destUsername,
        },
      },
      relations: ['creditor'],
    });
    if (debt) {
      await debtRepo.update(debt.id, {
        amount: debt.amount + debtAmount,
      });
    } else {
      await debtRepo.save({
        debtor: user,
        creditor: dest,
        amount: debtAmount,
      });
    }
  }
  await userRepo.update(user.id, { balance: newBalance });
  await userRepo.update(dest.id, { balance: precisionRound(dest.balance + amount) });
  await userUtil.refreshUser(userRepo, user.id);
  console.log('Transferred', amount, 'to', destUsername);
  const debts = await debtRepo.getDebts(user);
  debtUtil.list(debts);
  console.log('Your balance is', newBalance);
};