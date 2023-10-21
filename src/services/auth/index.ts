import * as SecureStore from 'expo-secure-store';
import { axiosInstance } from 'src/utils/axiosInstance';

import { invalidateUrl, loginUrl, refreshTokenUrl } from '@/services/endpoints';
import { LoginBody, LoginResponse, RefreshTokenResponse } from '@/types/index';

class AuthService {
	async login(body: LoginBody): Promise<LoginResponse> {
		try {
			const response = await axiosInstance.post<LoginResponse>(loginUrl, body);
			return response.data;
		} catch (error) {
			console.log('error', error);
			return Promise.reject(error);
		}
	}

	async invalidate(refreshToken: string): Promise<void> {
		try {
			await axiosInstance.post(invalidateUrl, {
				refreshToken,
			});
		} catch (error) {
			console.log('error', error);
		}
	}

	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const response = await axiosInstance.post<RefreshTokenResponse>(refreshTokenUrl, {
			refreshToken,
		});
		console.log('refreshToken', response);
		return response.data;
	}

	async getUserAgreement(): Promise<boolean> {
		const userAgreement = await SecureStore.getItemAsync('userAgreement');
		console.log('userAgreement', !!userAgreement);

		return !!userAgreement;
	}

	async setUserAgreement(): Promise<void> {
		await SecureStore.setItemAsync('userAgreement', 'agreed');
	}
}

export const authService = new AuthService();
