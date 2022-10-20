import test from 'ava';
import {
  extractCacheAttributes,
} from '../../../src/utilities/extractCacheAttributes';

test('returns null when query does not contain cache attributes', (t) => {
  t.is(extractCacheAttributes(''), null);
});

test('extracts @cache-ttl', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60'), {
    ttl: 60,
  });
});
