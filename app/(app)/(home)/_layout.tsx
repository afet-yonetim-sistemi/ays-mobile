import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

function Home() {
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
				name="userAgreement"
				options={{
					title: t('screens.home.userAgreementSheet.title'),
					presentation: 'modal',
					// headerLeft: () =>
					// 	Platform.OS === 'ios' ? (
					// 		<IconButton icon="arrow-left" onPress={() => router.back()} size={20} />
					// 	) : null,
				}}
			/>
		</Stack>
	);
}

export default Home;
