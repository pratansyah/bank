import 'colors';
import { getCustomRepository } from 'typeorm';
import DebtRepo from '../repositories/debtRepo';
import UserRepo from '../repositories/userRepo';
import * as userUtil from '../utils/user';
import * as debtUtil from '../utils/debt';
import { precisionRound } from '../utils/number';

export default async (params: string[]) => {
  if (!userUtil.isLoggedIn()) {
    console.log('You have to login first');
    return;
  }
  const user = userUtil.getUser();
  const amount = parseFloat(params[0]);
  if (Number.isNaN(amount)) {
    console.log('You have to input number for deposit amount');
    return;
  }

  const debtRepo = getCustomRepository(DebtRepo);
  const userRepo = getCustomRepository(UserRepo);

  let debts = await debtRepo.getDebts(user);
  let newBalance = precisionRound(user.balance + amount, 2);
  if (debts.length > 0) {
    let i = 0;
    while (newBalance > 0 && i < debts.length) {
      /* eslint-disable no-await-in-loop */
      let transfer = 0;
      const debt = debts[i];
      const { creditor } = debt;
      if (newBalance >= debt.amount) {
        transfer = debt.amount;
        newBalance -= transfer;
        await debtRepo.delete(debt.id);
      } else {
        transfer = newBalance;
        newBalance = 0;
        await debtRepo.update(debt.id, { amount: debt.amount - transfer });
      }
      await userRepo.update(debts[i].creditor.id, {
        balance: precisionRound(creditor.balance + transfer),
      });
      console.log('Transferred', transfer, 'to', creditor.username);
      i += 1;
    }
  }
  await userRepo.update(user.id, {
    balance: newBalance,
  });
  await userUtil.refreshUser(userRepo, user.id);
  debts = await debtRepo.getDebts(user);
  debtUtil.list(debts);
  console.log('Your balance is:', newBalance);
};
