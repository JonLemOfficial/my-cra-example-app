import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, DEFAULT_AUTH_STATE_VALUES } from './../context';
import useNotificationManager from './useNotificationManager';

function useAuth() {

  const isProd = process.env.NODE_ENV === 'production';
  const BACKEND_HOST = 'https://unergapp-bk.herokuapp.com';
  const [ authData, setAuthData ] = useContext(AuthContext);
  const notificationManager = useNotificationManager();
  const navigate = useNavigate();
  const location = useLocation();

  const removeAuthData = () => {
    setAuthData(DEFAULT_AUTH_STATE_VALUES);
  };

  const refreshAuth = async () => {
    const { data } = await axios.get(BACKEND_HOST + '/api/refresh', { withCredentials: true });
    if ( data?.accessToken ) {
      setAuthData({ accessToken: data.accessToken, isAuthenticated: true, user: data.user });
    } else if ( data?.error && data?.error?.name === 'TokenExpiredError' )  {
      notificationManager.add('Session Expired', 'Your session has expired, please login again', 'danger', 3000, {
        position: {
         desktop: 'top-right',
         mobile: 'top-center'
        }
      });
      removeAuthData();
      navigate(`/?redirectTo=${location.pathname}`, { state: { from: location }, replace: true });
    }
    return data?.accessToken || null;
  };

  const _loginRegisterActions = async ( endpoint, data, callback ) => {
    try {
      const response = await axios.post(BACKEND_HOST + `/api/${endpoint}`, data, {
        withCredentials: true
      });

      if ( response ) {
        callback(null, response);
      }
    } catch ( err ) {
      callback(err, null);
    }
  };

  const register = ({ fullname, username, email, password }, callback ) => {
    _loginRegisterActions('register', { fullname, username, email, password }, callback);
  };

  const logIn = async ({ username, password, rememberMe }, callback ) => {
    _loginRegisterActions('login', { username, password, rememberMe }, callback);
  };

  const logOut = async () => {
    try {
      await axios.get(BACKEND_HOST + '/api/logout', { withCredentials: true });
      notificationManager.add('Log out successfully', 'You\'ve been logged out successfully', 'success', 3000);
      removeAuthData();
      navigate('/login', { state: { from: location }, replace: true });
    } catch ( err ) {
      console.log(
        'Something went wrong while trying to log out the user'
      );
    }
  };

  return {
    authData,
    setAuthData,
    removeAuthData,
    refreshAuth,
    register,
    logIn,
    logOut
  };
}

export default useAuth;
