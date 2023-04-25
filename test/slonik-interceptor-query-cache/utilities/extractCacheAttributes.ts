import {
  extractCacheAttributes,
} from '../../../src/utilities/extractCacheAttributes';
import test from 'ava';

test('returns null when query does not contain cache attributes', (t) => {
  t.is(extractCacheAttributes('', []), null);
});

test('extracts @cache-ttl and @cache-id', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123\n-- @cache-hash-values false', []), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'FOO/bar_123',
    ttl: 60,
    valueHash: null,
  });
});

test('appends value hash', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123\n-- @cache-hash-values true', [
    1,
  ]), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'FOO/bar_123',
    ttl: 60,
    valueHash: '080a9ed428559ef602668b4c00f114f1a11c3f6b02a435f0bdc154578e4d7f22',
  });
});

test('appends value hash (by default)', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123', [
    1,
  ]), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'FOO/bar_123',
    ttl: 60,
    valueHash: '080a9ed428559ef602668b4c00f114f1a11c3f6b02a435f0bdc154578e4d7f22',
  });
});

test('does not appends value hash if there are no values', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key FOO/bar_123', []), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'FOO/bar_123',
    ttl: 60,
    valueHash: null,
  });
});

test('white spaces does not affect the query body hash', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key foo', []), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'foo',
    ttl: 60,
    valueHash: null,
  });

  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n\n-- @cache-key foo', []), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'foo',
    ttl: 60,
    valueHash: null,
  });
});

test('comments does not affect the query body hash', (t) => {
  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key foo', []), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'foo',
    ttl: 60,
    valueHash: null,
  });

  t.deepEqual(extractCacheAttributes('-- @cache-ttl 60\n-- @cache-key bar', []), {
    bodyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    key: 'bar',
    ttl: 60,
    valueHash: null,
  });
});
