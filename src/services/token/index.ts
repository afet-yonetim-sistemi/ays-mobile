import { AuthUser } from "@/types/index";
import * as SecureStore from "expo-secure-store";
import jwt_decode from "jwt-decode";
import { authService } from "../auth";

const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "",
  TOKEN_KEY: process.env.EXPO_PUBLIC_TOKEN_KEY ?? "",
};

const removeTokens = async () => {
  await SecureStore.deleteItemAsync(ENV.TOKEN_KEY);
  await SecureStore.deleteItemAsync(ENV.TOKEN_KEY + "_refresh");
};

const getRefreshToken = async () => {
  const refreshToken = await SecureStore.getItemAsync(
    ENV.TOKEN_KEY + "_refresh"
  );
  return refreshToken;
};

const getAccessToken = async () => {
  const accessToken = await SecureStore.getItemAsync(ENV.TOKEN_KEY);
  return accessToken;
};

const getIsAuthenticated = async () => {
  const accessToken = await SecureStore.getItemAsync(ENV.TOKEN_KEY);
  return !!accessToken;
};

const setTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync(ENV.TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(ENV.TOKEN_KEY + "_refresh", refreshToken);
  } catch (e) {
    console.log("Error setting tokens", e);
  }
};

const getUserFromToken = async (): Promise<AuthUser> => {
  const accessToken = await SecureStore.getItemAsync(ENV.TOKEN_KEY);
  if (!accessToken) return null;
  const decoded = jwt_decode(accessToken) as AuthUser;
  return decoded;
};

const checkTokenIsExpired = (exp: number) => {
  const now = Date.now() / 1000;
  console.log("token will expire in minutes", (exp - now) / 60);
  return exp < now;
};

export const tokenService = {
  removeTokens,
  getIsAuthenticated,
  setTokens,
  getAccessToken,
  getRefreshToken,
  getUserFromToken,
  checkTokenIsExpired,
};
