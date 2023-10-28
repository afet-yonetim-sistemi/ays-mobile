import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, View } from 'react-native';
import { Text } from 'react-native-paper';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import { permissionsAtom } from '@/stores/permissions';

export default function LocationNotAllowed() {
	const [permissions] = useAtom(permissionsAtom);
	const { t } = useTranslation();

	if (permissions.location) {
		return null;
	}

	const openSettings = () => {
		Linking.openSettings();
	};

	return (
		<Container>
			<Card>
				<View className="flex flex-col items-center justify-center space-y-2">
					<Image source={require('@/assets/images/location.png')} className="w-20 h-20 p-0" />

					<Text className="text-center pt-4 pb-6">{t('screens.locationNotAllowed.title')}</Text>
					<Button mode="contained" className="w-full" onPress={openSettings}>
						{t('buttons.continue').toUpperCase()}
					</Button>
				</View>
			</Card>
		</Container>
	);
}
