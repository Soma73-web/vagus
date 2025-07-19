import { useState, useEffect, useCallback } from 'react';
import autoRefreshManager from '../utils/autoRefresh';

export const useAutoRefresh = (fetchFunction, componentId, intervalMs = 180000) => {
  const [data, setData] = useState([]); // Default to empty array instead of null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result || []); // Ensure result is never null
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`Error fetching data for ${componentId}:`, err);
      setError(err.message || 'Failed to fetch data');
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, componentId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup auto-refresh
  useEffect(() => {
    const cleanup = autoRefreshManager.startAutoRefresh(componentId, fetchData, intervalMs);
    
    return cleanup;
  }, [componentId, fetchData, intervalMs]);

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