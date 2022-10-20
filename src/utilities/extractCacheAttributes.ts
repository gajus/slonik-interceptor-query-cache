export const extractCacheAttributes = (subject: string) => {
  const matches = /-- @cache-ttl (\d+)/u.exec(subject);

  if (matches) {
    return {
      ttl: Number(matches[1]),
    };
  }

  return null;
};
