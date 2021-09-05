import commands from '../src/commands';
import * as sinon from 'sinon';
import createConnection from '../src/db';
import * as rl from 'readline-sync';
import 'colors';
import * as fs from 'fs';

const tempDB = `${__dirname}/test.sqlite`;
const username = 'jest';
const password = '123pass';
beforeAll(async () => {
  const db = await createConnection(tempDB);
});

afterAll(async () => {
  await fs.unlinkSync(tempDB)
})

describe('register', function() {
  afterEach(() => {
    sinon.restore();
  });
  it('successfull after input empty string on prompts', async function() {
    const stub = sinon.stub(rl, 'question');
    stub.onCall(0).returns('');
    stub.onCall(1).returns(username);
    stub.onCall(2).returns('');
    stub.onCall(3).returns(password);
    let result = await commands.register();
    expect(result).toStrictEqual([
      `Your registration is successfull, here is your info:`,
      `Username: `.green + username
    ]);
  });

  it('failed username taken', async function() {
    const stub = sinon.stub(rl, 'question');
    stub.onCall(0).returns(username);
    stub.onCall(1).returns(password);
    let result = await commands.register();
    expect(result).toStrictEqual([
      'Username already taken, please try again'
    ]);
  });

  it('login', async function() {
    sinon.stub(rl, 'question').returns(password);
    let result = await commands.login([username]);
    expect(result).toStrictEqual([
      `Hello ${username}`,
      `Your balance is: ` + `$0`.green
    ]);
  });

  it('failed still login', async function() {
    let result = await commands.register();
    expect(result).toStrictEqual([
      'Please log out before registering a new account'
    ]);
  });
  
});