import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';

import Snackbar from '@/components/Snackbar';
import {
	darkTheme,
	lightTheme,
	navigationDarkTheme,
	navigationLightTheme,
} from '@/constants/themes';
import AuthProvider from '@/hooks/useAuth';
import { getLanguage } from '@/localization/index';
import { authService } from '@/services/auth';
import { locationService } from '@/services/location';
import { isAuthenticatedAtom } from '@/stores/auth';
import { permissionsAtom, userAgreementAtom } from '@/stores/permissions';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(app)/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RootLayoutNav />
			</AuthProvider>
		</QueryClientProvider>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);

	const { i18n } = useTranslation();
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});
	const [languageLoaded, setLanguageLoaded] = useState(false);
	const [permissions, setPermissions] = useAtom(permissionsAtom);
	const [userAgreement, setUserAgreement] = useAtom(userAgreementAtom);

	const setLocalLanguage = async () => {
		const language = await getLanguage();
		if (language) {
			i18n.changeLanguage(language);
		}
		setLanguageLoaded(true);
	};

	const checkLocationPermissions = async () => {
		const status = await locationService.checkLocationPermission();
		console.log('checkLocationPermissions', status);
		setPermissions((prev) => ({ ...prev, location: status, loaded: true }));

		if (status) {
			await checkBackgroundLocationPermissions();
		}
	};

	const checkBackgroundLocationPermissions = async () => {
		const status = await locationService.checkBackgroundPermission();
		console.log('checkBackgroundLocationPermissions', status);
		setPermissions((prev) => ({ ...prev, backgroundLocation: status, loaded: true }));
	};

	const checkUserAgreement = async () => {
		const status = await authService.getUserAgreement();
		setUserAgreement({ ...userAgreement, accepted: !!status, loaded: true });
	};

	const initializeApp = async () => {
		await setLocalLanguage();
		await checkUserAgreement();
		await checkLocationPermissions();
	};

	useEffect(() => {
		initializeApp();
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			initializeApp();
		}
	}, [isAuthenticated]);

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	const isSplashScreenHidden = useMemo(() => {
		return loaded && languageLoaded && userAgreement.loaded && permissions.loaded;
	}, [loaded, languageLoaded, userAgreement.loaded, permissions.loaded]);

	useEffect(() => {
		if (isSplashScreenHidden) {
			SplashScreen.hideAsync();
		}
	}, [isSplashScreenHidden]);

	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState: string) => {
			if (nextAppState === 'active') {
				checkLocationPermissions();
			}
			subscription.remove();
		});
	}, []);

	if (!loaded && !languageLoaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? navigationDarkTheme : navigationLightTheme}>
			<PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
				<Snackbar />
				<Slot />
			</PaperProvider>
		</ThemeProvider>
	);
}
