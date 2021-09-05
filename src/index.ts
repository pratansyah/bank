import * as rl from 'readline-sync';
import commands from './commands';
import createDatabaseConnection from './db';

global.user = false;

const printLines = (lines: string[]): void => {
  lines.forEach((line) => {
    console.log(line);
  });
  return null;
};

export const recursePrompt = async () => {
  const input = rl.question('\n> ').split(' ');
  if (input.length > 0) {
    const command = input[0].toLowerCase();
    input.splice(0, 1);
    if (command === 'exit') {
      console.log('Thank you for banking with us');
    } else if (commands[command]) {
      const lines = await commands[command](input);
      printLines(lines);
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
  await createDatabaseConnection(`${__dirname}/../.data/data.sqlite`);
  const menu = await commands.menu();
  printLines(menu);
  await recursePrompt();
})();
