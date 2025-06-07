import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';
import { getXP, incrementXP, resetXP } from '../xp.js';

beforeEach(() => {
  resetXP();
});

test('initial XP is 0', () => {
  assert.equal(getXP(), 0);
});

test('incrementXP adds to total', () => {
  const xp = incrementXP(5);
  assert.equal(xp, 5);
  assert.equal(getXP(), 5);
});

test('incrementXP rejects invalid amount', () => {
  assert.throws(() => incrementXP(-1), /Invalid XP amount/);
  assert.equal(getXP(), 0);
});
