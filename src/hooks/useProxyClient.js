import { useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

function useProxyClient(enablePrivateConfig = false) {

  const { authData, refreshAuth } =  useAuth();

  const publicProxyClient = axios.create({
    baseURL: 'https://unergapp-bk.herokuapp.com',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const privateProxyClient = axios.create({
    baseURL: 'https://unergapp-bk.herokuapp.com',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${authData?.accessToken}`
    },
    withCredentials: true
  });

  useEffect(() => {

    const requestIntercept = privateProxyClient.interceptors.request.use(
      config => {
        if ( !config.headers['Authorization'] ) {
          // console.log(`Sending request to url: '${config.url}', using method: '${config.method}', with aT: ${authData?.accessToken}`, );
          config.headers['Authorization'] = `Bearer ${authData?.accessToken}`;
        }

        return config;
      },
      err => Promise.reject(err)
    );

    const responseIntercept = privateProxyClient.interceptors.response.use(
      response => response,
      async err => {
        const previousRequest = err?.config;
        if ( ( err?.response?.status === 403 || err?.response?.status === 401 ) && !previousRequest?.sent ) {
            previousRequest.sent = true;
            // console.log('Refreshing token');
            previousRequest.headers['Authorization'] = `Bearer ${await refreshAuth()}`;
            return privateProxyClient(previousRequest);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      privateProxyClient.interceptors.request.eject(requestIntercept);
      privateProxyClient.interceptors.response.eject(responseIntercept);
    };

  }, [ authData, refreshAuth, privateProxyClient ]);

  return enablePrivateConfig ? privateProxyClient : publicProxyClient;
}

export default useProxyClient;
