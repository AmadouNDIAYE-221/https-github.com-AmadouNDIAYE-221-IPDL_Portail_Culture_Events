"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, userService } from '@/lib/api';
import { useRouter } from 'next/navigation';

/**
 * Type représentant un utilisateur connecté
 */
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

/**
 * Type pour les données d'enregistrement d'un nouvel utilisateur
 */
export type UserRegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
};

/**
 * Type définissant le contexte d'authentification
 */
export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistrationData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

/**
 * Création du contexte d'authentification
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Type pour les props du provider d'authentification
 */
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Composant fournisseur du contexte d'authentification
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // États pour gérer l'authentification
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Initialiser l'état d'authentification au chargement de l'application
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await userService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to get user data', err);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Fonction de connexion
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fonction d'enregistrement
   */
  const register = async (userData: UserRegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fonction de déconnexion
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Créer la valeur du contexte d'authentification
  const authContextValue: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  // Utilisation d'une syntaxe JSX explicite pour éviter les erreurs d'interprétation
  return React.createElement(
    AuthContext.Provider,
    { value: authContextValue },
    children
  );
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
