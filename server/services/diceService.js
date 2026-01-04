function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(notation) {
  // Example: "1d20+3", "2d6-1", "4d8"
  const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);

  if (!match) {
    throw new Error("Invalid dice notation: " + notation);
  }

  const num = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  let total = 0;
  const rolls = [];

  for (let i = 0; i < num; i++) {
    const r = rollDie(sides);
    rolls.push(r);
    total += r;
  }

  return {
    rolls,
    modifier,
    total: total + modifier
  };
}

module.exports = {
  rollDice
};
