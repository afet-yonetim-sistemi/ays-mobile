import { Stack, router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

function Settings() {
	const { t } = useTranslation();
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="languageModal"
				options={{
					title: t('screens.languageModal.title'),
					presentation: 'modal',
					headerLeft: () =>
						Platform.OS === 'ios' ? (
							<IconButton icon="arrow-left" onPress={() => router.back()} size={20} />
						) : null,
				}}
			/>
		</Stack>
	);
}

export default Settings;
