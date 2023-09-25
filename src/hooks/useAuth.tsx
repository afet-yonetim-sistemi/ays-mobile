import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthUser, LoginBody } from "../types";
import { authService } from "@/services/auth";
import { tokenService } from "@/services/token";
import { useRootNavigation, useRouter, useSegments } from "expo-router";
import { useAtom } from "jotai";
import { snackbarAtom } from "src/stores/ui";

type AuthContextType = {
  isAuthenticated: boolean | null;
  loading: boolean;
  login: (body: LoginBody) => void;
  logout: () => void;
  user: AuthUser;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  loading: true,
  login: () => {},
  logout: () => {},
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await tokenService.getIsAuthenticated();
      setIsAuthenticated(result);
    } catch (error) {
      console.error("Error checking authentication status:", error);
    } finally {
      //
      setLoading(false);
    }
  };

  const login = async (body: LoginBody) => {
    try {
      const result = await authService.login(body);
      if (result.isSuccess && result.response) {
        const { accessToken, refreshToken } = result.response;
        if (!accessToken || !refreshToken) {
          console.error("Error logging in:", result);
          return;
        }
        await tokenService.setTokens(accessToken, refreshToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setSnackbar({
        visible: true,
        message: "Kullanıcı adı veya şifre hatalı",
        severity: "error",
      });
      console.log("Error logging in:", error);
    }
  };

  const logout = async () => {
    // TODO: invalidate test 401 dönüyor
    const refreshToken = await tokenService.getRefreshToken();
    if (refreshToken) {
      await authService.invalidate(refreshToken);
    }
    await tokenService.removeTokens();
    setIsAuthenticated(false);
  };

  const useProtectedRoute = (isAuthenticated: boolean | null) => {
    const segments = useSegments();
    const router = useRouter();

    // checking that navigation is all good;
    const [isNavigationReady, setNavigationReady] = useState(false);
    const rootNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rootNavigation?.addListener("state", (event) => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rootNavigation]);

    React.useEffect(() => {
      if (!isNavigationReady) {
        return;
      }

      const inAuthGroup = segments[0] === "(auth)";
      console.log("inAuthGroup", segments[0]);
      if (loading || isAuthenticated === null) return;

      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/sign-in");
      } else if (isAuthenticated && inAuthGroup) {
        router.replace("/");
      }
    }, [isAuthenticated, segments, loading, isNavigationReady]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleUser();
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  const handleUser = async () => {
    try {
      const user = await tokenService.getUserFromToken();
      if (user && tokenService.checkTokenIsExpired(user.exp)) {
        await handleRefreshToken();
        return;
      }
      setUser(user);
    } catch (error) {
      console.error("Error getting user from token:", error);
      setUser(null);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const oldToken = await tokenService.getRefreshToken();
      if (oldToken) {
        const result = await authService.refreshToken(oldToken);
        if (result.isSuccess && result.response) {
          const { accessToken, refreshToken } = result.response;
          if (!accessToken || !refreshToken) {
            setUser(null);
            return;
          }
          await tokenService.setTokens(accessToken, refreshToken);
          const user = await tokenService.getUserFromToken();
          setUser(user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      setUser(null);
    }
  };

  useProtectedRoute(isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated || null,
        login,
        logout,
        loading,
        user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
