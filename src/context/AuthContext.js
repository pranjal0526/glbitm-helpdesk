import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  api,
  getApiErrorMessage,
  setAuthToken,
  STORAGE_KEY,
} from '../utils/api';

const ADMIN_CHALLENGE_STORAGE_KEY = 'glb_helpdesk_admin_challenge';

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    avatar: user.avatar || user.profilePicture || '',
    profilePicture: user.profilePicture || user.avatar || '',
  };
}

function readStorageValue(storage, key) {
  try {
    return storage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorageValue(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch (error) {
    return null;
  }

  return value;
}

function removeStorageValue(storage, key) {
  try {
    storage.removeItem(key);
  } catch (error) {
    return null;
  }

  return null;
}

function readPendingAdminChallenge() {
  const rawValue = readStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    removeStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    readStorageValue(localStorage, STORAGE_KEY)
  );
  const [pendingAdmin, setPendingAdmin] = useState(() =>
    readPendingAdminChallenge()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      const storedToken = readStorageValue(localStorage, STORAGE_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setAuthToken(storedToken);

      try {
        const { data } = await api.get('/user/me');

        if (!cancelled) {
          setToken(storedToken);
          setUser(normalizeUser(data.user));
          setPendingAdmin(null);
          removeStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);
        }
      } catch (error) {
        if (!cancelled) {
          removeStorageValue(localStorage, STORAGE_KEY);
          removeStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);
          setAuthToken(null);
          setToken(null);
          setUser(null);
          setPendingAdmin(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = (nextToken, nextUser) => {
    const normalizedUser = normalizeUser(nextUser);

    writeStorageValue(localStorage, STORAGE_KEY, nextToken);
    removeStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(normalizedUser);
    setPendingAdmin(null);
  };

  const setPendingAdminChallenge = (payload) => {
    writeStorageValue(
      sessionStorage,
      ADMIN_CHALLENGE_STORAGE_KEY,
      JSON.stringify(payload)
    );
    setPendingAdmin(payload);
  };

  const clearPendingAdminChallenge = () => {
    removeStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);
    setPendingAdmin(null);
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await api.post('/auth/google-login', {
      credential,
    });

    if (data.requiresAdminCode) {
      const pendingPayload = {
        challengeToken: data.challengeToken,
        user: normalizeUser(data.user),
      };

      setPendingAdminChallenge(pendingPayload);
      return {
        requiresAdminCode: true,
        user: data.user,
      };
    }

    persistSession(data.token, data.user);

    return {
      requiresAdminCode: false,
      user: data.user,
    };
  };

  const verifyAdminCode = async (accessCode) => {
    if (!pendingAdmin?.challengeToken) {
      throw new Error('Admin verification session is missing. Please sign in again.');
    }

    try {
      const { data } = await api.post('/auth/admin-verify', {
        challengeToken: pendingAdmin.challengeToken,
        accessCode,
      });

      persistSession(data.token, data.user);
      return data.user;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, 'Unable to verify admin access code.')
      );
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/user/me');
      const normalizedUser = normalizeUser(data.user);
      setUser(normalizedUser);
      return normalizedUser;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to refresh user session.'));
    }
  };

  const logout = async () => {
    removeStorageValue(localStorage, STORAGE_KEY);
    removeStorageValue(sessionStorage, ADMIN_CHALLENGE_STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setPendingAdmin(null);
  };

  const value = {
    user,
    token,
    pendingAdmin,
    loading,
    setUser,
    loginWithGoogle,
    verifyAdminCode,
    refreshUser,
    clearPendingAdminChallenge,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
