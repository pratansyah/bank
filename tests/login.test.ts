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
beforeAll(async () => {
  const db = await createConnection(tempDB);
  const userRepo = db.getCustomRepository(UserRepo);
  await userRepo.save({
    username,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  })
});

afterAll(async () => {
  await fs.unlinkSync(tempDB)
})

describe('login', function() {
  afterEach(() => {
    sinon.restore();
  });
  it('failed to connect to db connection already exist', async () => {
    try{
      await createConnection(tempDB)
    } catch(e) {
      expect(e.message).toStrictEqual(
        '[DB Error] Cannot create a new connection named "default", '+
        'because connection with such name already exist and it now has an active connection session.'
      )
    }
  })
  it('failed incomplete param', async () => {
    let result = await commands.login([]);
    expect(result).toStrictEqual([
      'Please input username'
    ]);
  });
  it('successfull', async function() {
    sinon.stub(rl, 'question').returns(password);
    let result = await commands.login([username]);
    expect(result).toStrictEqual([
      `Hello ${username}`,
      `Your balance is: ` + `$0`.green
    ]);
  });

  it('failed wrong password', async function() {
    sinon.stub(rl, 'question').returns('wrongPassword');
    let result = await commands.login([username]);
    expect(result).toStrictEqual([
      'Wrong password'
    ]);
  });
  
  it('failed user not found', async function() {
    let result = await commands.login(['wrongUsername']);
    expect(result).toStrictEqual([
      'We can not find that username, please try again'
    ]);
  });
  it('logout', async function() {
    sinon.stub(rl, 'question').returns(password);
    let result = await commands.logout();
    expect(result).toStrictEqual([
      'You are logged out'
    ]);
  });
});