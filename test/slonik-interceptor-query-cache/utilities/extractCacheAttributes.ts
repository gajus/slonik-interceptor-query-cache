import test from 'ava';
import {
  extractCacheAttributes,
} from '../../../src/utilities/extractCacheAttributes';

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
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123\n-- @cache-hash-values true', []), {
    key: 'FOO/bar_123:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    ttl: 60,
  });
});
