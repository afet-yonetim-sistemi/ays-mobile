import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { Button, Card, Checkbox, Switch, Text } from 'react-native-paper';

import UserAgreementAlert from '@/icons/UserAgreementAlert';
import { authService } from '@/services/auth';
import { userAgreementAtom } from '@/stores/permissions';

export default function UserAgreementNotAllowed() {
	const [userAgreement, setUserAgreement] = useAtom(userAgreementAtom);
	const { t } = useTranslation();
	const [isAllowed, setIsAllowed] = React.useState(false);
	console.log('userAgreement screen', userAgreement);
	if (userAgreement.accepted) {
		return null;
	}

	const onUserAgreement = () => {
		setIsAllowed((prev) => !prev);
	};

	const onSubmit = async () => {
		setUserAgreement({
			...userAgreement,
			accepted: true,
			loaded: true,
		});
		await authService.setUserAgreement();
	};

	function RenderCheckbox() {
		if (Platform.OS === 'android') {
			return <Checkbox status={isAllowed ? 'checked' : 'unchecked'} onPress={onUserAgreement} />;
		}
		if (Platform.OS === 'ios') {
			return <Switch value={isAllowed} onValueChange={onUserAgreement} />;
		}
		return null;
	}

	return (
		<Card elevation={4} className="w-11/12 p-4 space-y-3 bg-white dark:bg-secondary-800 m-12 py-8">
			<View className="flex flex-col items-center justify-center space-y-2">
				<UserAgreementAlert />
				<Text className="text-center pt-4 pb-6 font-bold">
					{t('screens.userAgreementNotAllowed.title')}
				</Text>
				<View
					className="flex flex-row items-center justify-between p-2"
					// onPress={onPress}
				>
					<View className="pr-2">
						<RenderCheckbox />
					</View>
					<Text className="text-secondary-500 dark:text-white text-md" style={{ flex: 1 }}>
						{t('screens.userAgreementNotAllowed.subtitle')}
					</Text>
				</View>
				<Button mode="contained" className="w-full" onPress={onSubmit} disabled={!isAllowed}>
					{t('buttons.continue').toUpperCase()}
				</Button>
			</View>
		</Card>
	);
}
