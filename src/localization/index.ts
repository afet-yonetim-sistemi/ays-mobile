import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/common.json';
import tr from './tr/common.json';

const resources = {
	en,
	tr,
};

i18n.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	resources,
	fallbackLng: 'tr',
	interpolation: {
		escapeValue: false,
	},
});

export const getLanguage = async () => {
	const language = await SecureStore.getItemAsync('language');
	if (!language) {
		const deviceLanguage = getLocales()[0].languageCode;
		if (resources.hasOwnProperty(deviceLanguage)) {
			console.log('language will set to', deviceLanguage);
			await setLanguage(deviceLanguage);
		}

		return deviceLanguage;
	}
	return language;
};

export const setLanguage = async (language: string) => {
	console.log('setLanguage', language);
	await SecureStore.setItemAsync('language', language);
};

export default i18n;
