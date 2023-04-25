import { normalizeCacheAttributes } from './normalizeCacheAttributes';
import test from 'ava';

test('replaces $bodyHash and $valueHash', (t) => {
  t.deepEqual(
    normalizeCacheAttributes({
      bodyHash: 'foo',
      key: '$bodyHash:$valueHash',
      ttl: 60,
      valueHash: 'bar',
    }),
    {
      key: 'foo:bar',
      ttl: 60,
    },
  );
});
