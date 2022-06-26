import axios from 'axios';

const defaultOptions = {
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
};

function _createProxyClient(options = {}) {

  options = Object.assing(defaultOptions, options);
  const proxyClient = axios.create(options);
  return proxyClient;
}

export default _createProxyClient;
