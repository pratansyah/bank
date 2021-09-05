import 'colors';

export default () => [
  '',
  'Available commands:',
  'menu'.green,
  'register'.green,
  `${'login'.green} [username]`,
  `${'deposit'.green} [amount]`,
  `${'transfer'.green} [username] [amount]`,
  'logout'.green,
  'exit'.green,
];
