import { Logger } from '../Logger';
import { extractCacheAttributes, normalizeCacheAttributes } from '../utilities';
import {
  type Interceptor,
  type Query,
  type QueryResult,
  type QueryResultRow,
} from 'slonik';

const log = Logger.child({
  namespace: 'createQueryCacheInterceptor',
});

type Sandbox = {
  cache: {
    cacheAttributes: CacheAttributes;
  };
};

export type CacheAttributes = {
  key: string;
  ttl: number;
};

type Storage = {
  get: (
    query: Query,
    cacheAttributes: CacheAttributes,
  ) => Promise<QueryResult<QueryResultRow> | null>;
  set: (
    query: Query,
    cacheAttributes: CacheAttributes,
    queryResult: QueryResult<QueryResultRow>,
  ) => Promise<void>;
};

type ConfigurationInput = {
  storage: Storage;
};

type Configuration = {
  storage: Storage;
};

export const createQueryCacheInterceptor = (
  configurationInput: ConfigurationInput,
): Interceptor => {
  const configuration: Configuration = {
    ...configurationInput,
  };

  return {
    beforeQueryExecution: async (context, query) => {
      if (context.transactionId) {
        return null;
      }

      const cacheAttributes = (context.sandbox as Sandbox).cache
        ?.cacheAttributes;

      if (!cacheAttributes) {
        return null;
      }

      const maybeResult = await configuration.storage.get(
        query,
        cacheAttributes,
      );

      if (maybeResult) {
        log.info(
          {
            queryId: context.queryId,
          },
          'query is served from cache',
        );

        return maybeResult;
      }

      return null;
    },
    beforeQueryResult: async (context, query, result) => {
      if (context.transactionId) {
        return null;
      }

      const cacheAttributes = (context.sandbox as Sandbox).cache
        ?.cacheAttributes;

      if (cacheAttributes) {
        await configuration.storage.set(query, cacheAttributes, result);
      }

      return null;
    },
    beforeTransformQuery: async (context, query) => {
      if (context.transactionId) {
        return null;
      }

      const extractedCacheAttributes = extractCacheAttributes(
        query.sql,
        query.values,
      );

      if (!extractedCacheAttributes) {
        return null;
      }

      const cacheAttributes = normalizeCacheAttributes(
        extractedCacheAttributes,
      );

      context.sandbox.cache = {
        cacheAttributes,
      };

      return null;
    },
  };
};
