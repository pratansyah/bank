export const precisionRound = (number: number, precision: number = 2) => {
  var factor = 10 ** precision;
  return Math.round(number * factor) / factor;
};
