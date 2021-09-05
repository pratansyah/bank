import commands from '../src/commands';
import * as sinon from 'sinon';
import createConnection from '../src/db';
import UserRepo from '../src/repositories/userRepo';
import * as rl from 'readline-sync';
import 'colors';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

const tempDB = `${__dirname}/test.sqlite`;
const username = 'jest';
const password = '123pass';
let creditor1;
beforeAll(async () => {
  const db = await createConnection(tempDB);
  const userRepo = db.getCustomRepository(UserRepo);
  await userRepo.save({
    username,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    balance: 100
  });
  await userRepo.save({
    username: 'creditor1',
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  });
  creditor1 = await userRepo.getOne({
    where: { username: 'creditor1' }
  })
});

afterAll(async () => {
  await fs.unlinkSync(tempDB)
})

describe('transfer', function() {
  afterEach(() => {
    sinon.restore();
  });

  it('failed transfer not logged in', async function() {
    let result = await commands.transfer([creditor1.username, '10']);
    expect(result).toStrictEqual([
      'You have to log in first',
    ]);
  });

  it('login', async function() {
    sinon.stub(rl, 'question').returns(password);
    let result = await commands.login([username]);
    expect(result).toStrictEqual([
      `Hello ${username}`,
      `Your balance is: ` + `$100`.green
    ]);
  });
  
  it('failed transfer incomplete params', async function() {
    let result = await commands.transfer([creditor1.username]);
    expect(result).toStrictEqual([
      'Please input username destination and amount',
    ]);
  });

  it('failed transfer invalid destination', async function() {
    let result = await commands.transfer(['foo', '100']);
    expect(result).toStrictEqual([
      'We can not find that username',
    ]);
  });

  it('success transfer enough balance', async function() {
    let result = await commands.transfer([creditor1.username, '50']);
    expect(result).toStrictEqual([
      `Transferred ` + `$50`.green + ` to ${creditor1.username}`,
      `Your balance is: ` + `$50`.green
    ]);
  });

  it('success transfer not enough balance', async function() {
    let result = await commands.transfer([creditor1.username, '150']);
    expect(result).toStrictEqual([
      `Transferred ` + `$150`.green + ` to ${creditor1.username}`,
      `You owed ` + `$100`.red + ` to ${creditor1.username}`,
      `Your balance is: ` + `$0`.green
    ]);
  });

  it('success transfer not enough balance to already indebted creditor', async function() {
    let result = await commands.transfer([creditor1.username, '150']);
    expect(result).toStrictEqual([
      `Transferred ` + `$150`.green + ` to ${creditor1.username}`,
      `You owed ` + `$250`.red + ` to ${creditor1.username}`,
      `Your balance is: ` + `$0`.green
    ]);
  });

  it('failed transfer NaN', async function() {
    let result = await commands.transfer([creditor1.username, '34.adf,324a*(']);
    expect(result).toStrictEqual([
      'You have to input number for the transfer amount',
    ]);
  });

});