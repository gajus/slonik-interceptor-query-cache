export const extractCacheAttributes = (subject: string) => {
  const ttl = /-- @cache-ttl (\d+)/u.exec(subject)?.[1];

  if (ttl) {
    const key = /-- @cache-key ([a-zA-Z0-9\-_:/]+)/ui.exec(subject)?.[1];

    if (!key) {
      throw new Error('@cache-key must be specified when @cache-ttl is specified.');
    }

    return {
      key,
      ttl: Number(ttl),
    };
  }

  return null;
};
