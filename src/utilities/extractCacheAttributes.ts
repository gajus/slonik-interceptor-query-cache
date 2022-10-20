export const extractCacheAttributes = (subject: string) => {
  const ttl = /-- @cache-ttl (\d+)/u.exec(subject)?.[1];

  if (ttl) {
    const id = /-- @cache-id ([a-zA-Z0-9\-_/]+)/ui.exec(subject)?.[1];

    if (!id) {
      throw new Error('@cache-id must be specified when @cache-ttl is specified.');
    }

    return {
      id,
      ttl: Number(ttl),
    };
  }

  return null;
};
