# slonik-interceptor-query-cache

[![Travis build status](http://img.shields.io/travis/gajus/slonik-interceptor-query-cache/master.svg?style=flat-square)](https://travis-ci.com/github/gajus/slonik-interceptor-query-cache)
[![Coveralls](https://img.shields.io/coveralls/gajus/slonik-interceptor-query-cache.svg?style=flat-square)](https://coveralls.io/github/gajus/slonik-interceptor-query-cache)
[![NPM version](http://img.shields.io/npm/v/slonik-interceptor-query-cache.svg?style=flat-square)](https://www.npmjs.org/package/slonik-interceptor-query-cache)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Caches [Slonik](https://github.com/gajus/slonik) query results.

## Usage

Query cache interceptor is initialised using a custom storage service. The [Example Usage](#example-usage) documentation shows how to create a compatible storage service using [`node-cache`](https://www.npmjs.com/package/node-cache).

Which queries are cached is controlled using cache attributes. Cache attributes are comments starting with `-- @cache-` prefix. Only queries with cache attributes are cached (see [Cache attributes](#cache-attributes))

## Behavior

* Does not cache queries inside of a transaction.
* Does not take into account the query parameters.

## Cache attributes

|Cache attribute|Description|Required?|Default|
|---|---|---|---|
|`@cache-ttl`|Number (in seconds) to cache the query for.|Yes|N/A|
|`@cache-key`|Key (`/^[A-Za-z0-9\-_:]+$/`) that uniquely identifies the query.|Yes|N/A|

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