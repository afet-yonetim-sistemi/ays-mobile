/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import ENV from '@/constants/env';
import { invalidateUrl, loginUrl, refreshTokenUrl } from '@/services/endpoints';
import { tokenService } from '@/services/token';
import { RefreshTokenResponse } from '@/types/index';

// Create an instance of Snackbar

// Axios instance
const axiosInstance: AxiosInstance = axios.create({
	baseURL: `${ENV.API_URL}`,
	timeout: 3000,
});

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: any) => {
	const { url } = failedRequest.response.config;

	if (failedRequest.response.status !== 401) {
		return Promise.reject(failedRequest);
	}

	if (url.includes(loginUrl) || url.includes(invalidateUrl)) {
		return Promise.reject(failedRequest);
	}

	const oldRefreshToken = await tokenService.getRefreshToken();

	if (!oldRefreshToken) {
		return Promise.reject(failedRequest);
	}
	try {
		const { data } = await axiosInstance.post<RefreshTokenResponse['response']>(
			refreshTokenUrl,
			{
				refreshToken: oldRefreshToken,
			},
			{
				headers: {
					authorization: false,
				},
			}
		);

		if (!data) {
			return await Promise.reject(failedRequest);
		}

		const { accessToken, refreshToken } = data || {};

		if (!accessToken || !refreshToken) {
			return await Promise.reject(failedRequest);
		}

		// save new tokens
		await tokenService.setTokens(accessToken, refreshToken);
		// set header
		failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

		// retry failed request
		return await Promise.resolve();
	} catch (error) {
		await tokenService.removeTokens();
		return Promise.reject(failedRequest);
	}
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
	shouldRefresh: (failedRequest: any) => {
		const { url } = failedRequest.response.config;
		if (url === loginUrl || url === invalidateUrl) {
			return false;
		}
		if (url === refreshTokenUrl) {
			tokenService.removeTokens();
			return false;
		}
		return true;
	},
});

// it will be called before every request
axiosInstance.interceptors.request.use(
	async (config) => {
		const accessToken = await tokenService.getAccessToken();
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		if (config.url === refreshTokenUrl) {
			config.headers.Authorization = null;
		}

		// if method is patch, convert it to put
		if (config.method === 'patch') {
			config.method = 'put';
		}

		return config;
	},
	(error) => {
		console.log('error', error);
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => response,

	(error) => {
		console.log('error', error);
		return Promise.reject(error);
	}
);

// handle axios errors

export default axiosInstance;
