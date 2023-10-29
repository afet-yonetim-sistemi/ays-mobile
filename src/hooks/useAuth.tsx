import { useRootNavigation, useRouter, useSegments } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { snackbarAtom } from 'src/stores/ui';

import { authService } from '@/services/auth';
import { tokenService } from '@/services/token';
import { assignmentTrackingAtom, defaultAssignmentTracking } from '@/stores/assignment';
import { isAuthenticatedAtom, loadingAtom, userAtom } from '@/stores/auth';
import {
	initialPermissions,
	initialUserAgreement,
	permissionsAtom,
	userAgreementAtom,
} from '@/stores/permissions';
import { AuthUser, LoginBody } from '@/types';

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

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
	children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
	const { t } = useTranslation();
	const setSnackbar = useSetAtom(snackbarAtom);
	const resetPermissions = useSetAtom(permissionsAtom);
	const resetUserAgreement = useSetAtom(userAgreementAtom);
	const resetAssignmentTracking = useSetAtom(assignmentTrackingAtom);
	const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
	const [loading, setLoading] = useAtom(loadingAtom);
	const [user, setUser] = useAtom(userAtom);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const result = await tokenService.getIsAuthenticated();
			setIsAuthenticated(result);
		} catch (error) {
			console.error('Error checking authentication status:', error);
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
					console.error('Error logging in:', result);
					return;
				}
				await tokenService.setTokens(accessToken, refreshToken);
				setIsAuthenticated(true);
			}
		} catch (error) {
			setSnackbar({
				visible: true,
				message: t('screens.signIn.errors.usernameOrPassword'),
				severity: 'error',
			});
			console.log('Error logging in:', error);
		}
	};

	const logout = async () => {
		// TODO: invalidate test 401 dönüyor
		const refreshToken = await tokenService.getRefreshToken();
		if (refreshToken) {
			await authService.invalidate(refreshToken);
		}
		await tokenService.removeTokens();
		allocateUserSettings();
		setIsAuthenticated(false);
	};

	const allocateUserSettings = async () => {
		await resetPermissions(initialPermissions);
		await resetUserAgreement(initialUserAgreement);
		await resetAssignmentTracking(defaultAssignmentTracking);
	};

	const useProtectedRoute = (isAuthenticated: boolean | null) => {
		const segments = useSegments();
		const router = useRouter();

		// checking that navigation is all good;
		const [isNavigationReady, setNavigationReady] = useState(false);
		const rootNavigation = useRootNavigation();

		useEffect(() => {
			const unsubscribe = rootNavigation?.addListener('state', (_event) => {
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

			const inAuthGroup = segments[0] === '(auth)';
			if (loading || isAuthenticated === null) return;

			if (!isAuthenticated && !inAuthGroup) {
				router.replace('/sign-in');
			} else if (isAuthenticated && inAuthGroup) {
				router.replace('/');
			}
		}, [isAuthenticated, segments, loading, isNavigationReady]);
	};

	useEffect(() => {
		handleUser();
	}, [isAuthenticated]);

	const handleUser = async () => {
		try {
			const user = await tokenService.getUserFromToken();
			// await tokenService.checkRefreshTokenIsExpired();
			if (user && tokenService.checkTokenIsExpired(user.exp)) {
				await handleRefreshToken();
				return;
			}
			setUser(user);
		} catch (error) {
			console.error('Error getting user from token:', error);
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
				} else {
					setUser(null);
					setIsAuthenticated(false);
				}
			}
		} catch (error) {
			setUser(null);
			setIsAuthenticated(false);
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
}

export default AuthProvider;
