import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, RadioButton } from 'react-native-paper';

import { setLanguage } from '@/localization';

type Language = {
	key: string;
};

const languages: Language[] = [
	{
		key: 'en',
	},
	{
		key: 'tr',
	},
];

const LanguageModal = () => {
	const { i18n, t } = useTranslation();

	const selectedLanguage = i18n.language;

	const renderLanguage = (language: Language) => {
		const onPress = () => {
			i18n.changeLanguage(language.key);
			setLanguage(language.key);
		};
		return (
			<TouchableOpacity
				className="flex flex-row items-center justify-between p-2"
				onPress={onPress}
			>
				<Text className="text-secondary-500 dark:text-white text-md" style={{ flex: 1 }}>
					{t(`languages.${language.key}`)}
				</Text>
				<RadioButton
					value={language.key}
					status={selectedLanguage === language.key ? 'checked' : 'unchecked'}
					onPress={onPress}
				/>
			</TouchableOpacity>
		);
	};

	return (
		<FlatList
			data={languages}
			renderItem={({ item }) => renderLanguage(item)}
			ItemSeparatorComponent={() => <Divider />}
		/>
	);
};

export default LanguageModal;
