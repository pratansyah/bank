import * as rl from 'readline-sync';
import commands from './commands';
import createDatabaseConnection from './db';

global.user = false;

const recursePrompt = async () => {
  const input = rl.question('').split(' ');
  if (input.length > 0) {
    const command = input[0];
    input.splice(0, 1);
    if (command === 'exit') {
      console.log('Thank you for banking with us');
    } else if (commands[command]) {
      await commands[command](input);
      await recursePrompt();
    } else {
      console.log('No such command');
      await recursePrompt();
    }
  } else {
    await recursePrompt();
  }
};

(async () => {
  await createDatabaseConnection();
  // await commands.menu();
  await recursePrompt();
})();
