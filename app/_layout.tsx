import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { PermissionStatus } from 'expo-location';
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
import { locationService } from '@/services/location';
import { isAuthenticatedAtom } from '@/stores/auth';
import { PermissionsAtomType, permissionsAtom, userAgreementAtom } from '@/stores/permissions';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(app)',
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
	const userAgreement = useAtomValue(userAgreementAtom);

	const setLocalLanguage = async () => {
		const language = await getLanguage();
		if (language) {
			i18n.changeLanguage(language);
		}
		setLanguageLoaded(true);
	};

	const checkLocationPermissions = async () => {
		const permissions = await locationService.getLocationPermissions();
		console.log({ permissions });
		await setPermissions((prev: PermissionsAtomType) => ({
			...prev,
			loaded: true,
			location: permissions[0],
			backgroundLocation: permissions[1],
		}));
	};

	const requestLocationPermissions = async () => {
		const locationPermissions = await locationService.getLocationPermissions();

		const goToSettings = locationPermissions.filter(
			(permission) => permission === 'DO_NOT_ASK_AGAIN'
		);

		if (goToSettings.length) {
			await setPermissions((prev: PermissionsAtomType) => ({
				...prev,
				loaded: true,
				location: locationPermissions[0],
				backgroundLocation: locationPermissions[1],
			}));
			return;
		}

		const status = await locationService.requestLocationPermission();
		await setPermissions((prev: PermissionsAtomType) => ({
			...prev,
			location: status,
			loaded: status !== PermissionStatus.GRANTED,
		}));

		if (status) {
			await requestBackgroundLocationPermissions();
		}
	};

	const requestBackgroundLocationPermissions = async () => {
		const status = await locationService.requestBackgroundPermission();
		await setPermissions((prev: PermissionsAtomType) => ({
			...prev,
			backgroundLocation: status,
			loaded: true,
		}));
	};

	// const checkUserAgreement = async () => {
	// 	await setUserAgreement((prev: UserAgreementAtomType) => ({ ...prev, loaded: true }));
	// };

	const initializeApp = async () => {
		await setLocalLanguage();
		await requestLocationPermissions();
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
	}, [loaded, languageLoaded, userAgreement, permissions]);

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
		});
		return () => {
			subscription.remove();
		};
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
