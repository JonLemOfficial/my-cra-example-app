import React, { useState, useEffect, useCallback, createContext } from 'react';
import axios from 'axios';
import { LoadPage } from './../screens';

export const DEFAULT_AUTH_STATE_VALUES = {
  accessToken: null,
  isAuthenticated: false,
  user: {
    id: null,
    username: null,
    fullname: null,
    email: null
  }
};

const AuthContext = createContext(DEFAULT_AUTH_STATE_VALUES); 

export const AuthProvider = ({ children }) => {
  
  const isProd = process.env.NODE_ENV === 'production';
  const [ authData, setAuthData ] = useState(DEFAULT_AUTH_STATE_VALUES);
  const [ loading, setLoading ] = useState(true);

  const loadApp = useCallback(async () => {
    try {
      // console.log('Fetching user!!!');
      let { data } = await axios.get('https://unergapp-bk.herokuapp.com/api/refresh', { withCredentials: true });
      if ( data?.accessToken ) {
        // console.log('User found:', data.user);
        setAuthData({ accessToken: data.accessToken, isAuthenticated: true, user: data.user });
      } else {
        // console.log('NO user found');
        setAuthData(DEFAULT_AUTH_STATE_VALUES);
      }
    } catch (e) {
      console.log('Error thrown', e);
      setAuthData(DEFAULT_AUTH_STATE_VALUES);
    }
    // setTimeout(() => {
      setLoading(false);
    // }, 5000);
  });

  useEffect(() => {
    loadApp();
  }, []);

  return (
    <AuthContext.Provider value={[ authData, setAuthData ]}>
      { !loading && children || <LoadPage/> }
    </AuthContext.Provider>
  );

};

export default AuthContext;
