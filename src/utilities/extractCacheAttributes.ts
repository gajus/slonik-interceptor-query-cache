import {
  createHash,
} from 'node:crypto';
import {
  type PrimitiveValueExpression,
} from 'slonik';

const hash = (subject: string) => {
  return createHash('sha256').update(subject).digest('hex');
};

export const extractCacheAttributes = (subject: string, values: readonly PrimitiveValueExpression[]) => {
  const ttl = /-- @cache-ttl (\d+)/u.exec(subject)?.[1];

  if (ttl) {
    let key = /-- @cache-key ([a-zA-Z0-9\-_:/]+)/ui.exec(subject)?.[1];

    if (!key) {
      throw new Error('@cache-key must be specified when @cache-ttl is specified.');
    }

    if (!/-- @cache-hash-values false/ui.test(subject) && values.length > 0) {
      key += ':' + hash(JSON.stringify(values));
    }

    return {
      key,
      ttl: Number(ttl),
    };
  }

  return null;
};
