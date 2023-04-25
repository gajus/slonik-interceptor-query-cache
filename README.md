# slonik-interceptor-query-cache

[![NPM version](http://img.shields.io/npm/v/slonik-interceptor-query-cache.svg?style=flat-square)](https://www.npmjs.org/package/slonik-interceptor-query-cache)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Caches [Slonik](https://github.com/gajus/slonik) query results.

## Usage

Query cache interceptor is initialized using a custom storage service. The [Example Usage](#example-usage) documentation shows how to create a compatible storage service using [`node-cache`](https://www.npmjs.com/package/node-cache).

Which queries are cached is controlled using cache attributes. Cache attributes are comments starting with `-- @cache-` prefix. Only queries with cache attributes are cached (see [Cache attributes](#cache-attributes))

## Behavior

* Does not cache queries inside of a transaction.

## Cache attributes

|Cache attribute|Description|Required?|Format|Default|
|---|---|---|---|---|
|`@cache-ttl`|Number (in seconds) to cache the query for.|Yes|`/^d+$/`|N/A|
|`@cache-key`|Cache key that uniquelly identifies the query.|No|`/^[$A-Za-z0-9\-_:]+$/`|`$bodyHash:$valueHash`|
|`@cache-discard-empty`|If set to `true`, then `storage.set` is not invoked when query produces no results.|No|`/^(false|true)$/`|`false`|

### `@cache-key`

Overrides the default cache key that uniquely identifies the query.

If present, `$bodyHash` is substituted with the hash of the query (comments and white-spaces are stripped before hashing the query). `$valueHash` is substituted with the hash of the parameter values.

### Example usage

This example shows how to create a compatible storage service using [`node-cache`](https://www.npmjs.com/package/node-cache).

```js
import NodeCache from 'node-cache';
import {
  createPool
} from 'slonik';
import {
  createQueryCacheInterceptor
} from 'slonik-interceptor-query-cache';

const nodeCache = new NodeCache({
  checkperiod: 60,
  stdTTL: 60,
  useClones: false,
});

const pool = await createPool('postgres://', {
  interceptors: [
    createQueryCacheInterceptor({
      storage: {
        get: (query, cacheAttributes) => {
          // Returning null results in the query being executed.
          return cache.get(cacheAttributes.key) || null;
        },
        set: (query, cacheAttributes, queryResult) => {
          cache.set(cacheAttributes.key, queryResult, cacheAttributes.ttl);
        },
      },
    }),
  ]
});

// Caches the query results based on a combination of the query hash and the parameter value hash.
await connection.any(sql`
  -- @cache-ttl 60
  SELECT
    id,
    code_alpha_2
  FROM country
  WHERE
    code_alpha_2 = ${countryCode}
`);

// Caches the query results based only on the parameter value hash.
await connection.any(sql`
  -- @cache-ttl 60
  -- @cache-key $bodyHash
  SELECT
    id,
    code_alpha_2
  FROM country
  WHERE
    code_alpha_2 = ${countryCode}
`);

// Caches the query results using 'foo' key.
await connection.any(sql`
  -- @cache-ttl 60
  -- @cache-key foo
  SELECT
    id,
    code_alpha_2
  FROM country
  WHERE
    code_alpha_2 = ${countryCode}
`);
```