import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { StyledComponent } from 'nativewind';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';

import { useHeights } from '@/hooks/useHeights';
import ProfileArea from '@/screens/drawer/ProfileArea';
import { permissionsAtom } from '@/stores/permissions';

export default function ModalScreen() {
	const { statusBarHeight, bottomTabBarHeight } = useHeights();
	const { t, i18n } = useTranslation();
	const [permissions] = useAtom(permissionsAtom);
	const openLanguageModal = () => {
		router.push('/languageModal');
	};

	const marginTop = statusBarHeight + (Platform.OS === 'android' ? 12 : 0);

	return (
		<View
			className="flex flex-1 items-center justify-center"
			style={{
				marginTop,
			}}
		>
			<ProfileArea />
			<View className="flex-1 w-full space-y-2">
				<Divider className="mb-2" />
				<Text className=" dark:text-white pb-2 px-2 text-base">
					{t('screens.settings.applicationSettings.title')}
				</Text>
				<Divider />
				<Pressable className="flex flex-row items-center px-4" onPress={openLanguageModal}>
					<StyledComponent
						component={FontAwesome}
						name="language"
						className="text-secondary-500 dark:text-white text-xl pr-4"
					/>
					<View className="flex flex-row justify-between items-center flex-1">
						<Text className="text-secondary-500 dark:text-white text-md">
							{t('screens.settings.applicationSettings.language')}
						</Text>
						<Text>{t(`languages.${i18n.language}`)}</Text>
					</View>
				</Pressable>
				<Divider />
				<View className="flex flex-row items-center px-4">
					<StyledComponent
						component={FontAwesome}
						name="map-marker"
						className="text-secondary-500 dark:text-white text-xl pr-4"
					/>
					<View className="flex flex-row justify-between items-center flex-1">
						<Text className="text-secondary-500 dark:text-white text-md">
							{t('screens.settings.applicationSettings.location')}
						</Text>
						<AllowedIcon allowed={permissions.location} />
					</View>
				</View>
				<Divider />
			</View>
			<View
				className="w-full px-4"
				style={{
					marginBottom: bottomTabBarHeight ? bottomTabBarHeight - 8 : 8,
				}}
			>
				<Button
					textColor="red"
					onPress={() => {
						console.log('logout');
					}}
				>
					{t('buttons.deleteMyAccount')}
				</Button>
			</View>
		</View>
	);
}

type AllowedIconProps = {
	allowed: boolean;
};

function AllowedIcon({ allowed }: AllowedIconProps) {
	let className = 'text-2xl pr-2';

	if (allowed) {
		className += ' text-green-500';
	} else {
		className += ' text-red-500';
	}
	return (
		<StyledComponent
			component={FontAwesome}
			name={allowed ? 'check-circle' : 'times-circle'}
			className={className}
		/>
	);
}
