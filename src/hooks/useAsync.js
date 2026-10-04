import { useCallback, useEffect, useRef, useState } from 'react';

export function useAsync(loader, initialData = null) {
  const hasData = useRef(initialData != null);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialData == null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!hasData.current) setLoading(true);
    setError('');
    try {
      const next = await loader();
      hasData.current = next != null;
      setData(next);
    } catch (err) {
      if (!hasData.current) setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
