import { useState, useEffect, useCallback, useRef } from 'react';
import autoRefreshManager from '../utils/autoRefresh';

export const useAutoRefresh = (fetchFunction, componentId, intervalMs = 180000) => {
  const [data, setData] = useState([]); // Default to empty array instead of null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Use ref to store the latest fetchFunction to avoid dependency issues
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunctionRef.current();
      setData(result || []); // Ensure result is never null
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`Error fetching data for ${componentId}:`, err);
      setError(err.message || 'Failed to fetch data');
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [componentId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup auto-refresh
  useEffect(() => {
    const cleanup = autoRefreshManager.startAutoRefresh(componentId, fetchData, intervalMs);
    
    return cleanup;
  }, [componentId, fetchData, intervalMs]);

  // Debug logging
  useEffect(() => {
    console.log(`${componentId} - Loading: ${loading}, Error: ${error}, Data length: ${data?.length || 0}`);
  }, [componentId, loading, error, data]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
}; 