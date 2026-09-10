import { useEffect, useState } from 'react';

// TODO: implement generic data fetching hook (loading, error, data)
const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: call fetcher and update state
  }, deps);

  return { data, loading, error };
};

export default useFetch;
