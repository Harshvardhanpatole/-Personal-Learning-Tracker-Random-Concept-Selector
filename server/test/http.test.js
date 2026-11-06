import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, stringValue } from '../src/utils/http.js';

test('stringValue trims valid input and supports optional fields', () => {
  assert.equal(stringValue('  Java  ', 20, 'Name', { required: true }), 'Java');
  assert.equal(stringValue('', 20, 'Description'), null);
});

test('stringValue rejects missing or oversized required input', () => {
  assert.throws(() => stringValue('', 20, 'Name', { required: true }), ApiError);
  assert.throws(() => stringValue('12345', 4, 'Name'), ApiError);
});
