import axios from 'axios';

export const STORAGE_KEY = 'glb_helpdesk_token';
const isBrowser = typeof window !== 'undefined';
const isLocalEnvironment =
  isBrowser &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalEnvironment ? 'http://localhost:5000/api' : '/api');
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const ALLOWED_DOMAIN =
  process.env.REACT_APP_ALLOWED_DOMAIN || 'glbitm.ac.in';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong.') {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}
