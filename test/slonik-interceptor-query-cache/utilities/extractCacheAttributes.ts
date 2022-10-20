import test from 'ava';
import {
  extractCacheAttributes,
} from '../../../src/utilities/extractCacheAttributes';

test('returns null when query does not contain cache attributes', (t) => {
  t.is(extractCacheAttributes(''), null);
});

test('extracts @cache-ttl and @cache-id', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-id FOO/bar_123'), {
    id: 'FOO/bar_123',
    ttl: 60,
  });
});
