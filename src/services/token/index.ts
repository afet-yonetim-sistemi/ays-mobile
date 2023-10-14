import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';

import ENV from '@/constants/env';
import { AuthUser } from '@/types/index';

const removeTokens = async () => {
	await SecureStore.deleteItemAsync(ENV.TOKEN_KEY);
	await SecureStore.deleteItemAsync(`${ENV.TOKEN_KEY}_refresh`);
	// user settings
	await SecureStore.deleteItemAsync('userAgreement');
	// await SecureStore.deleteItemAsync('language');
};

const getRefreshToken = async () => {
	const refreshToken = await SecureStore.getItemAsync(`${ENV.TOKEN_KEY}_refresh`);
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
		await SecureStore.setItemAsync(`${ENV.TOKEN_KEY}_refresh`, refreshToken);
		console.log('Tokens set');
	} catch (e) {
		console.log('Error setting tokens', e);
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
	console.log('token will expire in seconds', (exp - now) / 60);
	return exp < now;
};

const checkRefreshTokenIsExpired = async () => {
	const refreshToken = await getRefreshToken();
	if (!refreshToken) return true;
	const now = Date.now() / 1000;
	const decoded = jwt_decode(refreshToken) as AuthUser;
	console.log('refresh token will expire in minutes', decoded ? (decoded?.exp - now) / 60 : null);

	if (!decoded) {
		return true;
	}

	return decoded.exp < now;
};

export const tokenService = {
	removeTokens,
	getIsAuthenticated,
	setTokens,
	getAccessToken,
	getRefreshToken,
	getUserFromToken,
	checkTokenIsExpired,
	checkRefreshTokenIsExpired,
};
