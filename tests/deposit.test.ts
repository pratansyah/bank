import commands from '../src/commands';
import * as sinon from 'sinon';
import createConnection from '../src/db';
import UserRepo from '../src/repositories/userRepo';
import DebtRepo from '../src/repositories/debtRepo';
import * as rl from 'readline-sync';
import 'colors';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import User from '../src/entities/user';
import { Connection } from 'typeorm';

const tempDB = `${__dirname}/test.sqlite`;
const username = 'jest';
const password = '123pass';
let creditor1: User;
let creditor2: User;
let creditor3: User;
let user: User;
let db: Connection;

beforeAll(async () => {
  db = await createConnection(tempDB);
  const debtRepo = db.getCustomRepository(DebtRepo);
  const userRepo = db.getCustomRepository(UserRepo);
  await userRepo.save({
    username,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  })
  await userRepo.save({
    username: 'creditor1',
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  });
  await userRepo.save({
    username: 'creditor2',
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  })
  await userRepo.save({
    username: 'creditor3',
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  })

  user = await userRepo.getOne({
    where: { username }
  });
  creditor1 = await userRepo.getOne({
    where: { username: 'creditor1' }
  })
  creditor2 = await userRepo.getOne({
    where: { username: 'creditor2' }
  })
  creditor3 = await userRepo.getOne({
    where: { username: 'creditor3' }
  })

  await debtRepo.save({
    amount: 15,
    debtor: user,
    creditor: creditor1
  });
  await debtRepo.save({
    amount: 25.5,
    debtor: user,
    creditor: creditor2
  });
  await debtRepo.save({
    amount: 50.75,
    debtor: user,
    creditor: creditor3
  });
});

afterAll(async () => {
  await fs.unlinkSync(tempDB)
})

describe('deposit', function() {
  afterEach(() => {
    sinon.restore();
  });

  it('failed deposit not logged in', async function() {
    let result = await commands.deposit(['10']);
    expect(result).toStrictEqual([
      'You have to login first',
    ]);
  });

  it('login', async function() {
    sinon.stub(rl, 'question').returns(password);
    let result = await commands.login([username]);
    expect(result).toStrictEqual([
      `Hello ${username}`,
      `Your balance is: ` + `$0`.green,
      `You owed ` + `$15`.red + ` to ${creditor1.username}`,
      `You owed ` + `$25.5`.red + ` to ${creditor2.username}`,
      `You owed ` + `$50.75`.red + ` to ${creditor3.username}`
    ]);
  });

  it('auto partial payment to first creditor', async () => {
    let result = await commands.deposit(['10']);
    expect(result).toStrictEqual([
      `Transferred ` + `$10`.green + ` to ${creditor1.username}`,
      `You owed ` + `$5`.red + ` to ${creditor1.username}`,
      `You owed ` + `$25.5`.red + ` to ${creditor2.username}`,
      `You owed ` + `$50.75`.red + ` to ${creditor3.username}`,
      `Your balance is: ` + `$0`.green
    ]);
  })

  it('auto settled to first creditor and overflow partial payment to second creditor', async () => {
    let result = await commands.deposit(['20']);
    expect(result).toStrictEqual([
      `Transferred ` + `$5`.green + ` to ${creditor1.username}`,
      `Transferred ` + `$15`.green + ` to ${creditor2.username}`,
      `You owed ` + `$10.5`.red + ` to ${creditor2.username}`,
      `You owed ` + `$50.75`.red + ` to ${creditor3.username}`,
      `Your balance is: ` + `$0`.green
    ]);
  })

  it('auto settled to second creditor and no overflow payment to third creditor', async () => {
    let result = await commands.deposit(['10.5']);
    expect(result).toStrictEqual([
      `Transferred ` + `$10.5`.green + ` to ${creditor2.username}`,
      `You owed ` + `$50.75`.red + ` to ${creditor3.username}`,
      `Your balance is: ` + `$0`.green
    ]);
  })

  it('auto settled to third creditor and overflow to own account', async () => {
    let result = await commands.deposit(['65']);
    expect(result).toStrictEqual([
      `Transferred ` + `$50.75`.green + ` to ${creditor3.username}`,
      `Your balance is: ` + `$14.25`.green
    ]);
  })

  it('success deposit round number', async function() {
    let result = await commands.deposit(['100']);
    expect(result).toStrictEqual([
      `Your balance is: ` + `$114.25`.green
    ]);
  });

  it('success deposit decimal number', async function() {
    let result = await commands.deposit(['100.12']);
    expect(result).toStrictEqual([
      `Your balance is: ` + `$214.37`.green
    ]);
  });

  it('failed deposit NaN', async function() {
    let result = await commands.deposit(['12.string']);
    expect(result).toStrictEqual([
      'You have to input number for deposit amount'
    ]);
  });

});