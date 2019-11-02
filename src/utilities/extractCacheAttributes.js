// @flow

export default (subject: string) => {
  const matches = subject.match(/@cache-ttl (\d+)/);

  if (matches) {
    return {
      ttl: Number(matches[1]),
    };
  }

  return null;
};
