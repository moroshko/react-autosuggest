import { expect } from 'chai';
import compareObjects from '../../src/compareObjects';

const obj = { a: 1 };
const noop = () => {};

const cases = [
  {
    objA: {},
    objB: {},
    result: false,
  },
  {
    objA: obj,
    objB: obj,
    result: false,
  },
  {
    objA: { a: 5 },
    objB: { a: 5 },
    result: false,
  },
  {
    objA: { a: 1 },
    objB: { b: 1 },
    result: true,
  },
  {
    objA: { a: 1 },
    objB: { a: 1, b: 2 },
    result: true,
  },
  {
    objA: { a: 1, b: 2 },
    objB: { a: 1 },
    result: true,
  },
  {
    objA: { a: 5, b: false, c: 'hey' },
    objB: { a: 5, b: false, c: 'hey' },
    result: false,
  },
  {
    objA: { a: noop },
    objB: { a: noop },
    result: false,
  },
  {
    objA: { a: noop },
    objB: { a: noop },
    keys: ['a'],
    result: false,
  },
  {
    objA: { a: () => {} },
    objB: { a: () => {} },
    result: true,
  },
  {
    objA: { a: () => {} },
    objB: { a: () => {} },
    keys: ['a'],
    result: true,
  },
  {
    objA: { a: { b: 9 } },
    objB: { a: { b: 9 } },
    result: true,
  },
  {
    objA: { a: { b: 9 } },
    objB: { a: { b: 9 } },
    keys: ['a'],
    result: false,
  },
  {
    objA: { a: { b: 9 } },
    objB: { a: null },
    keys: ['a'],
    result: true,
  },
  {
    objA: { a: null },
    objB: { a: { b: 9 } },
    keys: ['a'],
    result: true,
  },
  {
    objA: { a: { b: 9, c: 'hi' } },
    objB: { a: { b: 9 } },
    keys: ['a'],
    result: true,
  },
  {
    objA: { a: { b: 9 } },
    objB: { a: { b: 9, c: 'hi' } },
    keys: ['a'],
    result: true,
  },
  {
    objA: { a: { b: 9 }, c: { d: null } },
    objB: { a: { b: 9 }, c: { d: null } },
    keys: ['a', 'c'],
    result: false,
  },
  {
    objA: { a: { b: 9 }, c: { d: {} } },
    objB: { a: { b: 9 }, c: { d: {} } },
    keys: ['a', 'c'],
    result: true,
  },
];

describe('compareObjects', () => {
  cases.forEach(({ objA, objB, keys, result }) => {
    it(`should return ${result} for ${JSON.stringify(
      objA
    )} and ${JSON.stringify(objB)}${keys ? ` with keys ${keys}` : ''}`, () => {
      expect(compareObjects(objA, objB, keys)).to.equal(result);
    });
  });
});
