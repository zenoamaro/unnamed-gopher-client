import {useState, useEffect} from 'react';

export function useLoadEffect<T>(
  fn: () => Promise<T>,
  deps: readonly any[] = [],
): [
  boolean,
  Error | void,
] {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fn().then(() => {setError(undefined); setLoading(false)})
      .catch((err) => {setError(err); setLoading(false)});
    return () => {};
  }, deps);

  return [loading, error]
}
