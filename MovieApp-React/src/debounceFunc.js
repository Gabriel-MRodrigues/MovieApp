import { useState, useEffect } from 'react';

export const debounceSearchTerm = (value, delay) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedSearchTerm;
};
