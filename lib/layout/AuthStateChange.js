import React, { useEffect, useState } from 'react'
import Loader from '../../components/common/Loader';
import useAuth from '../hook/AuthProvider'
import { AuthService } from '../service/AuthService';

export default function AuthStateChange({ children }) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.waitForUser((userInfo) => {
      setUser(userInfo);
      setLoading(false);
    });
    //  eslint-disable-next-line
  }, []);

  if (loading) return (<Loader />)

  return children;
}
