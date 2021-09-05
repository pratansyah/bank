import commands from '../src/commands';
import * as sinon from 'sinon';
import createConnection from '../src/db';
import * as rl from 'readline-sync';
import 'colors';


beforeAll(async () => {
  await createConnection();
})
describe('calculate', function() {

  afterEach(() => {
    sinon.restore();
  });
  // it('login', async function() {
  //   sinon.stub(rl, 'question').returns('123');
  //   let result = await commands.login(['diky3']);
  //   console.log(result, 'here');
  //   expect(result).toBe(7);
  // });
  it('register', async function() {
    const stub = sinon.stub(rl, 'question');
    stub.onCall(0).returns('jest');
    stub.onCall(1).returns('123');
    let result = await commands.register();
    expect(result).toStrictEqual([
      'Your registration is successfull, here is your info:',
      'Username: '.green + 'jest'
    ]);
  })
});