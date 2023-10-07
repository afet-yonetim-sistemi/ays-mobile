import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import LocationAlert from '@/icons/LocationAlert';
import { permissionsAtom, userAgreementAtom } from '@/stores/permissions';

export default function LocationNotAllowed() {
	const [permissions] = useAtom(permissionsAtom);
	const [userAgreement] = useAtom(userAgreementAtom);
	const { t } = useTranslation();

	if (permissions.location || !userAgreement.accepted) {
		return null;
	}

	const openSettings = () => {
		Linking.openSettings();
	};

	return (
		<Card elevation={4} className="w-11/12 p-4 space-y-3 bg-white dark:bg-secondary-800 m-12 py-8">
			<View className="flex flex-col items-center justify-center space-y-2">
				<LocationAlert />
				<Text className="text-center pt-4 pb-6">{t('screens.locationNotAllowed.title')}</Text>
				<Button mode="contained" className="w-full" onPress={openSettings}>
					{t('buttons.continue').toUpperCase()}
				</Button>
			</View>
		</Card>
	);
}
