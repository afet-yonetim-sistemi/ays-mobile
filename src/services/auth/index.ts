import axiosInstance from 'src/utils/axiosInstance';

import {
	invalidateUrl,
	loginUrl,
	refreshTokenUrl,
	userSelfUpdateUrl,
	userSelfUrl,
} from '@/services/endpoints';
import {
	DefaultResponse,
	LoginBody,
	LoginResponse,
	RefreshTokenResponse,
	UserSelfResponse,
	UserSelfSupportStatusRequest,
} from '@/types/index';

class AuthService {
	async login(body: LoginBody): Promise<LoginResponse> {
		try {
			console.log('request body', body, axiosInstance);
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
		return response.data;
	}

	async setUserSelf(): Promise<UserSelfResponse['response']> {
		const response = await axiosInstance.get(userSelfUrl);
		const user = response.data as UserSelfResponse;

		return user.response;
	}

	async setUserSelfStatus({
		supportStatus,
	}: UserSelfSupportStatusRequest): Promise<DefaultResponse['isSuccess']> {
		try {
			const response = await axiosInstance.put(userSelfUpdateUrl, {
				supportStatus,
			});
			const user = response.data as DefaultResponse;

			if (!user.isSuccess) {
				throw new Error('Kullanıcı durumu güncellenemedi');
			}
			console.log('user', user);
			return user.isSuccess;
		} catch (error) {
			console.log('error', JSON.stringify(error));
			return Promise.reject(error);
		}
	}
}

export const authService = new AuthService();
