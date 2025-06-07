let userXP = 0;

export function getXP() {
  return userXP;
}

export function incrementXP(amount) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Invalid XP amount');
  }
  userXP += amount;
  return userXP;
}

export function resetXP() {
  userXP = 0;
}
