import Debt from '../entities/debt';

export function list(debts: Debt[]) {
  if (debts.length > 0) {
    debts.forEach((debt) => {
      console.log('You owed', debt.amount, 'to', debt.creditor.username);
    });
  }
}
