import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, View } from 'react-native';
import { Checkbox, Switch, Text } from 'react-native-paper';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import { userAgreementAtom } from '@/stores/permissions';

export default function UserAgreementNotAllowed() {
	const [userAgreement, setUserAgreement] = useAtom(userAgreementAtom);
	const { t } = useTranslation();
	const [isAllowed, setIsAllowed] = React.useState(false);

	if (userAgreement.accepted || !userAgreement.loaded) {
		return null;
	}

	const onUserAgreement = () => {
		setIsAllowed((prev) => !prev);
	};

	const onSubmit = async () => {
		await setUserAgreement({
			...userAgreement,
			accepted: true,
			loaded: true,
		});
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
		<Container>
			<Card>
				<View className="flex flex-col items-center justify-center space-y-5 px-3">
					<Image source={require('@/assets/images/userAgreement.png')} className="w-20 h-20 p-0" />
					<Text className="text-center py-4 font-bold">
						{t('screens.userAgreementNotAllowed.title')}
					</Text>
					<View
						className="flex flex-row items-center justify-between p-2 pb-4"
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
		</Container>
	);
}
