import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
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
		setPermissions({ ...permissions, location: status, loaded: true });
	};

	const checkUserAgreement = async () => {
		const status = await authService.getUserAgreement();
		setUserAgreement({ ...userAgreement, accepted: !!status, loaded: true });
	};

	useEffect(() => {
		setLocalLanguage();
		checkUserAgreement();
		checkLocationPermissions();
	}, []);

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded && languageLoaded && userAgreement.loaded && permissions.loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded, languageLoaded, userAgreement.loaded, permissions.loaded]);

	if (!loaded && !languageLoaded) {
		return null;
	}

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

	return (
		<ThemeProvider value={colorScheme === 'dark' ? navigationDarkTheme : navigationLightTheme}>
			<PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
				<Snackbar />
				<Slot />
			</PaperProvider>
		</ThemeProvider>
	);
}
