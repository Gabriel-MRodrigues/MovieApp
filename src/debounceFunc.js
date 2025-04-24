import { useState, useEffect } from 'react';

// debounce function to debounce searchTerm from main application
// it receives a value (searchTerm) and the delay > 0
// creates a useState to set the debounced search term
// and it only sets the debounced search term after user stops typing and after the delay time specified as a parameter
export const debounceSearchTerm = (value, delay) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, delay);

    // returns the useEffect and resets timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedSearchTerm;
};
