import {
  extractCacheAttributes,
} from '../../../src/utilities/extractCacheAttributes';
import test from 'ava';

test('returns null when query does not contain cache attributes', (t) => {
  t.is(extractCacheAttributes('', []), null);
});

test('extracts @cache-ttl and @cache-id', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123\n-- @cache-hash-values false', []), {
    key: 'FOO/bar_123',
    ttl: 60,
  });
});

test('appends value hash', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123\n-- @cache-hash-values true', [
    1,
  ]), {
    key: 'FOO/bar_123:080a9ed428559ef602668b4c00f114f1a11c3f6b02a435f0bdc154578e4d7f22',
    ttl: 60,
  });
});

test('appends value hash (by default)', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123', [
    1,
  ]), {
    key: 'FOO/bar_123:080a9ed428559ef602668b4c00f114f1a11c3f6b02a435f0bdc154578e4d7f22',
    ttl: 60,
  });
});

test('does not appends value hash if there are no values', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123', []), {
    key: 'FOO/bar_123',
    ttl: 60,
  });
});
