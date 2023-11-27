import { PermissionStatus } from 'expo-location';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, View } from 'react-native';
import { Text } from 'react-native-paper';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import { locationService } from '@/services/location';
import { PermissionsAtomType, permissionsAtom } from '@/stores/permissions';

export default function LocationNotAllowed() {
	const [permissions, setPermissions] = useAtom(permissionsAtom);
	const { t } = useTranslation();

	if (
		(permissions.location === PermissionStatus.GRANTED &&
			permissions.backgroundLocation === PermissionStatus.GRANTED) ||
		!permissions.loaded
	) {
		return null;
	}

	const checkLocationPermissions = async () => {
		const status = await locationService.requestLocationPermission();
		await setPermissions((prev: PermissionsAtomType) => ({
			...prev,
			location: status,
			loaded: status !== PermissionStatus.GRANTED,
		}));

		if (status) {
			await checkBackgroundLocationPermissions();
		}
	};

	const checkBackgroundLocationPermissions = async () => {
		const status = await locationService.requestBackgroundPermission();
		await setPermissions((prev: PermissionsAtomType) => ({
			...prev,
			backgroundLocation: status,
			loaded: true,
		}));
	};

	const openSettings = async () => {
		const locationPermissions = await locationService.getLocationPermissions();

		const goToSettings = locationPermissions.filter(
			(permission) => permission === 'DO_NOT_ASK_AGAIN'
		);
		console.log('locationPermissions', locationPermissions);
		if (goToSettings.length) {
			Linking.openSettings();
		} else {
			await checkLocationPermissions();
		}
	};

	return (
		<Container>
			<Card>
				<View className="flex flex-col items-center justify-center space-y-2">
					<Image source={require('@/assets/images/location.png')} className="w-20 h-20 p-0" />

					<Text className="text-center pt-4 pb-6">{t('screens.locationNotAllowed.title')}</Text>
					<Button mode="contained" className="w-full" onPress={openSettings}>
						{t('buttons.share')}
					</Button>
				</View>
			</Card>
		</Container>
	);
}
