import Debt from '../entities/debt';
import 'colors';

export const list = (debts: Debt[]) => {
  const result = [];
  if (debts.length > 0) {
    debts.forEach((debt) => {
      result.push(`You owed ${`$${debt.amount}`.red} to ${debt.creditor.username}`);
    });
  }
  return result;
};
