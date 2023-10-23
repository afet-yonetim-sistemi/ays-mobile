import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Image, Platform, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { Input } from '@/components/forms/Input';
import { useAuth } from '@/hooks/useAuth';
import { LoginBody } from '@/types/index';

const iosUser = {
	username: '930047',
	password: '367894',
};
const androidUser = {
	username: '449493',
	password: '320186',
};

function SignIn() {
	const {
		control,
		handleSubmit,

		formState: { errors },
	} = useForm<LoginBody>({
		defaultValues: Platform.OS === 'android' ? androidUser : iosUser,
	});
	const { login } = useAuth();
	const { t } = useTranslation();

	return (
		<View className="flex flex-1 justify-center items-center w-full p-4 dark:bg-secondary-900">
			<Card elevation={4} className="w-full p-4 space-y-3 bg-white dark:bg-secondary-500 py-8">
				<View className="flex w-full justify-center items-center">
					<Image source={require('@/assets/logo-radius.png')} className="w-28 h-28 p-0" />
				</View>
				<Text variant="titleLarge" className="text-primary-500 dark:text-white text-center">
					{t('screens.signIn.title')}
				</Text>
				<Text variant="bodyMedium" className="text-primary-500 dark:text-white text-center pb-3">
					{t('screens.signIn.subtitle')}
				</Text>
				<Input
					name="username"
					label={t('screens.signIn.fields.username')}
					control={control}
					mode="outlined"
					rules={{
						required: t('errors.required', {
							field: t('screens.signIn.fields.username'),
						}),
					}}
					error={!!errors.username}
					errorText={errors.username?.message}
				/>
				<Input
					name="password"
					label={t('screens.signIn.fields.password')}
					control={control}
					mode="outlined"
					rules={{
						required: t('errors.required', {
							field: t('screens.signIn.fields.password'),
						}),
					}}
					error={!!errors.password}
					errorText={errors.password?.message}
					secureTextEntry
				/>
				<Button onPress={handleSubmit(login)} mode="contained">
					{t('screens.signIn.fields.button').toUpperCase()}
				</Button>
			</Card>
		</View>
	);
}

export default SignIn;
