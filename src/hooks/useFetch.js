import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest } from '../axios';

const useFetch = (url, method = 'GET', body = null, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = method === 'GET' 
        ? await getRequest(url, body, options) 
        : await postRequest(url, body, options);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, method, body, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
