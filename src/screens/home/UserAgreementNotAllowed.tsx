import { PermissionStatus } from 'expo-location';
import { router } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, View } from 'react-native';
import { Checkbox, Switch, Text } from 'react-native-paper';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import { permissionsAtom, userAgreementAtom, userAgreementSheetAtom } from '@/stores/permissions';

export default function UserAgreementNotAllowed() {
	const { t } = useTranslation();
	const [userAgreement, setUserAgreement] = useAtom(userAgreementAtom);
	const [userAgreementSheet, setUserAgreementSheet] = useAtom(userAgreementSheetAtom);
	const permissions = useAtomValue(permissionsAtom);

	if (
		userAgreement.accepted ||
		!userAgreement.loaded ||
		permissions.location !== PermissionStatus.GRANTED ||
		permissions.backgroundLocation !== PermissionStatus.GRANTED
	) {
		return null;
	}

	const onUserAgreement = () => {
		setUserAgreementSheet((prev) => ({ ...prev, isApproved: !prev.isApproved }));
	};

	const onSubmit = async () => {
		await setUserAgreement({
			...userAgreement,
			accepted: true,
			loaded: true,
		});
	};

	const openUserAgreement = async () => {
		router.push('/userAgreement');
	};

	function RenderCheckbox() {
		if (Platform.OS === 'android') {
			return (
				<Checkbox
					status={userAgreementSheet.isApproved ? 'checked' : 'unchecked'}
					onPress={onUserAgreement}
				/>
			);
		}
		if (Platform.OS === 'ios') {
			return <Switch value={userAgreementSheet.isApproved} onValueChange={onUserAgreement} />;
		}
		return null;
	}

	return (
		<Container>
			<Card>
				<View className="flex flex-col items-center justify-center space-y-5 px-3">
					<Image source={require('@/assets/images/userAgreement.png')} className="w-20 h-20 p-0" />
					<Text className="text-secondary-500 dark:text-white text-md">
						{t('screens.userAgreementNotAllowed.continueUsage')}
						<Text className="underline" onPress={openUserAgreement}>
							{t('screens.userAgreementNotAllowed.userAgreement')}
						</Text>
						{t('screens.userAgreementNotAllowed.period')}
					</Text>
					<View className="flex flex-row items-center justify-between p-2 pb-4">
						<View className="pr-2">
							<RenderCheckbox />
						</View>
						<Text className="text-secondary-500 dark:text-white text-md" style={{ flex: 1 }}>
							{t('screens.userAgreementNotAllowed.subtitle')}
						</Text>
					</View>
					<Button
						mode="contained"
						className="w-full"
						onPress={onSubmit}
						disabled={!userAgreementSheet.isApproved}
					>
						{t('buttons.continue')}
					</Button>
				</View>
			</Card>
		</Container>
	);
}
