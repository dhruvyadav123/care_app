import { useEffect, useState } from 'react';

const useAuthToken = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return token;
};

export default useAuthToken;
