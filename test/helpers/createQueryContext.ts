import type {
  QueryContextType,
} from 'slonik';

export default (): QueryContextType => {
  return {
    connectionId: '1',
    log: {
      getContext: () => {
        return {
          connectionId: '1',
          poolId: '1',
        };
      },
    },
    poolId: '1',
  };
};
