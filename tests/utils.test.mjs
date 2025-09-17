import assert from 'node:assert/strict';
import { clamp, validateEmail, deriveDisplayName } from '../src/utils.mjs';

// clamp
assert.equal(clamp(5, 0, 10), 5);
assert.equal(clamp(-1, 0, 10), 0);
assert.equal(clamp(99, 0, 10), 10);

// validateEmail
assert.equal(validateEmail('user@example.com'), true);
assert.equal(validateEmail('bad@com'), false);
assert.equal(validateEmail(''), false);

// deriveDisplayName
assert.equal(deriveDisplayName('hello@world.com'), 'hello');
assert.equal(deriveDisplayName('no-at-symbol'), 'no-at-symbol');
assert.equal(deriveDisplayName(''), '');

console.log('utils.test.mjs passed');

