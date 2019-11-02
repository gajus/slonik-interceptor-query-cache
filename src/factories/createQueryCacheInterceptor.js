// @flow

import type {
  InterceptorType,
  QueryType,
  QueryResultRowType,
  QueryResultType,
} from 'slonik';
import {
  extractCacheAttributes,
} from '../utilities';
import log from '../Logger';

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

// eslint-disable-next-line flowtype/no-weak-types
const defaultConfiguration: Object = {};

export default (configurationInput?: ConfigurationInputType): InterceptorType => {
  const configuration: ConfigurationType = {
    ...defaultConfiguration,
    ...configurationInput,
  };

  return {
    beforeQueryExecution: async (context, query) => {
      const cacheAttributes = context.sandbox.cache && context.sandbox.cache.cacheAttributes;

      if (!cacheAttributes) {
        return null;
      }

      const maybeResult = await configuration.storage.get(query, cacheAttributes);

      if (maybeResult) {
        log.info({
          queryId: context.queryId,
        }, 'query is served from cache');

        return maybeResult;
      }

      return null;
    },
    beforeQueryResult: async (context, query, result) => {
      const cacheAttributes = context.sandbox.cache && context.sandbox.cache.cacheAttributes;

      if (cacheAttributes) {
        await configuration.storage.set(query, cacheAttributes, result);
      }

      return null;
    },
    beforeTransformQuery: async (context, query) => {
      const cacheAttributes = extractCacheAttributes(query.sql);

      if (!cacheAttributes) {
        return null;
      }

      context.sandbox.cache = {
        cacheAttributes,
      };

      return null;
    },
  };
};
