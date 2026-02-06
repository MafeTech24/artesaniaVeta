import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type StoredUser = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string; // MVP only
  createdAt: string;
};

export type AuthUser = {
  id: string;
  name: string; // compat con Navbar
  email: string;
  phone?: string;
};

type RegisterPayload = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  resetPassword: (email: string) => Promise<{ ok: boolean; message?: string } | null>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_USERS_KEY = 'artesania_veta_db_users';
const LS_AUTH_USER_KEY = 'artesania_veta_auth_user';
const LS_AUTH_TOKEN_KEY = 'artesania_veta_auth_token';

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  const p = phone.trim();
  return /^\+?\d{8,20}$/.test(p);
}

function validatePassword(password: string) {
  // 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

const PASSWORD_RULE =
  'La contraseña debe tener al menos 8 caracteres, con 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = safeParseJSON<AuthUser>(localStorage.getItem(LS_AUTH_USER_KEY));
    const token = localStorage.getItem(LS_AUTH_TOKEN_KEY);

    if (storedUser && token) setUser(storedUser);
    else setUser(null);

    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const loadUsers = (): StoredUser[] => {
    const parsed = safeParseJSON<StoredUser[]>(localStorage.getItem(LS_USERS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
  };

  const persistSession = (authUser: AuthUser) => {
    localStorage.setItem(LS_AUTH_USER_KEY, JSON.stringify(authUser));
    localStorage.setItem(LS_AUTH_TOKEN_KEY, `mock_${authUser.id}_${Date.now()}`);
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    await sleep(500);

    const e = normalizeEmail(email);
    if (!validateEmail(e)) {
      setIsLoading(false);
      setError('Ingresá un email válido.');
      return;
    }
    if (!password || !validatePassword(password)) {
      setIsLoading(false);
      setError(PASSWORD_RULE);
      return;
    }

    const users = loadUsers();
    const found = users.find((u) => normalizeEmail(u.email) === e);

    if (!found || found.password !== password) {
      setIsLoading(false);
      setError('Credenciales incorrectas.');
      return;
    }

    const authUser: AuthUser = {
      id: found.id,
      name: found.fullName,
      email: found.email,
      phone: found.phone,
    };

    setUser(authUser);
    persistSession(authUser);
    setIsLoading(false);
  };

  const register = async (payload: RegisterPayload) => {
    setError(null);
    setIsLoading(true);
    await sleep(600);

    const fullName = payload.fullName.trim();
    const phone = payload.phone.trim();
    const email = normalizeEmail(payload.email);
    const password = payload.password;

    if (fullName.length < 2 || fullName.length > 80) {
      setIsLoading(false);
      setError('El nombre completo debe tener entre 2 y 80 caracteres.');
      return;
    }
    if (!validatePhone(phone)) {
      setIsLoading(false);
      setError('Ingresá un teléfono válido (solo números, opcional +, 8–20).');
      return;
    }
    if (!validateEmail(email)) {
      setIsLoading(false);
      setError('Ingresá un email válido.');
      return;
    }
    if (!password || !validatePassword(password)) {
      setIsLoading(false);
      setError(PASSWORD_RULE);
      return;
    }

    const users = loadUsers();
    const exists = users.some((u) => normalizeEmail(u.email) === email);

    if (exists) {
      setIsLoading(false);
      setError('Ese email ya está registrado. Probá ingresar.');
      return;
    }

    const newUser: StoredUser = {
      id: crypto?.randomUUID?.() ? crypto.randomUUID() : `u_${Date.now()}`,
      fullName,
      phone,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUsers([newUser, ...users]);

    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
    };

    setUser(authUser);
    persistSession(authUser);
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setIsLoading(true);
    await sleep(500);

    const e = normalizeEmail(email);
    if (!validateEmail(e)) {
      setIsLoading(false);
      setError('Ingresá un email válido.');
      return null;
    }

    const users = loadUsers();
    const found = users.find((u) => normalizeEmail(u.email) === e);
    if (!found) {
      setIsLoading(false);
      setError('No encontramos un usuario con ese email.');
      return null;
    }

    setIsLoading(false);
    return { ok: true, message: 'Te enviamos un correo con instrucciones para recuperar tu cuenta.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_AUTH_USER_KEY);
    localStorage.removeItem(LS_AUTH_TOKEN_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      resetPassword,
      logout,
      clearError,
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
