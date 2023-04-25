import {
  createHash,
} from 'node:crypto';
import {
  type PrimitiveValueExpression,
} from 'slonik';
import stripComments from 'strip-comments';

const hash = (subject: string) => {
  return createHash('sha256').update(subject).digest('hex');
};

export const extractCacheAttributes = (subject: string, values: readonly PrimitiveValueExpression[]) => {
  const ttl = /-- @cache-ttl (\d+)/u.exec(subject)?.[1];

  let valueHash: string | null = null;

  // https://github.com/jonschlinkert/strip-comments/issues/71
  const bodyHash = hash(stripComments(subject).replaceAll(/^\s*--.*$/ugm, '').replaceAll(/\s/gu, ''));

  if (ttl) {
    const key = /-- @cache-key ([a-zA-Z0-9\-_:/]+)/ui.exec(subject)?.[1];

    if (!key) {
      throw new Error('@cache-key must be specified when @cache-ttl is specified.');
    }

    if (!/-- @cache-hash-values false/ui.test(subject) && values.length > 0) {
      valueHash = hash(JSON.stringify(values));
    }

    return {
      bodyHash,
      key,
      ttl: Number(ttl),
      valueHash,
    };
  }

  return null;
};
