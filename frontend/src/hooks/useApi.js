import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Custom hook for API calls with loading states and error handling
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          toast({
            title: "Error",
            description: err.message || "An error occurred while fetching data",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while fetching data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook for mutation operations (create, update, delete)
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const mutate = async (mutationFn, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn();
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage
        });
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (options.onError) {
        options.onError(err);
      }
      
      toast({
        title: "Error",
        description: options.errorMessage || err.message || "An error occurred",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};