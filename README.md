# slonik-interceptor-query-cache

[![Travis build status](http://img.shields.io/travis/gajus/slonik-interceptor-query-cache/master.svg?style=flat-square)](https://travis-ci.org/gajus/slonik-interceptor-query-cache)
[![Coveralls](https://img.shields.io/coveralls/gajus/slonik-interceptor-query-cache.svg?style=flat-square)](https://coveralls.io/github/gajus/slonik-interceptor-query-cache)
[![NPM version](http://img.shields.io/npm/v/slonik-interceptor-query-cache.svg?style=flat-square)](https://www.npmjs.org/package/slonik-interceptor-query-cache)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Caches [Slonik](https://github.com/gajus/slonik) queries.

## Usage

Query cache interceptor is initialised using a custom storage service. The [Example Usage](#example-usage) documentation shows how to create a compatible storage service using [`node-cache`](https://www.npmjs.com/package/node-cache).

Which queries are cached is controlled using cache attributes. Cache attributes are comments starting with `@cache-` prefix. Only queries with cache attributes are cached (see [Cache attributes](#cache-attributes))

## API

```js
import {
  createQueryCacheInterceptor
} from 'slonik-interceptor-query-cache';

```

```js
type CacheAttributesType = {|
  +ttl: number,
|};

type StorageType = {|
  +get: (query: QueryType, cacheAttributes: CacheAttributesType) => Promise<QueryResultType<QueryResultRowType> | null>,
  +set: (query: QueryType, cacheAttributes: CacheAttributesType, queryResult: QueryResultType<QueryResultRowType>) => Promise<void>,
|};

type ConfigurationInputType = {|
  +storage: StorageType,
|};

type ConfigurationType = {|
  +storage: StorageType,
|};

(configurationInput: ConfigurationInputType) => InterceptorType;

```

## Cache attributes

|Cache attribute|Description|Required?|Default|
|---|---|---|---|
|`@cache-ttl`|Number (in seconds) to cache the query for.|Yes|N/A|

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

const interceptors = [
  createQueryCacheInterceptor({
    storage: {
      get: (query) => {
        return cache.get(JSON.stringify(query)) || null;
      },
      set: (query, cacheAttributes, queryResult) => {
        cache.set(JSON.stringify(query), queryResult, cacheAttributes.ttl);
      },
    },
  }),
];

const pool = createPool('postgres://', {
  interceptors
});

await connection.any(sql`
  -- @cache-ttl 60
  SELECT
    id,
    code_alpha_2
  FROM country
  WHERE
    code_alpha_2 = ${countryCode}
`);

```
