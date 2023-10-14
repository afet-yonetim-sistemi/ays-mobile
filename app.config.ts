import { ConfigContext, ExpoConfig } from 'expo/config';

const env = process.env.MY_ENV ?? '.env';
require('dotenv').config({ path: `.env.${env}` });
const packageNameSlug = process.env.APP_SLUG ? '.' + process.env.APP_SLUG : '';
const packageName = 'com.aysmobile' + packageNameSlug;
const appName = process.env.APP_NAME || 'Afet Yönetim Sistemi';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'ays-mobile',
	name: appName,
	ios: {
		...config.ios,
		bundleIdentifier: packageName,
	},
	android: {
		...config.android,
		package: packageName,
		config: {
			...config.android?.config,
			googleMaps: {
				apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
			},
		},
	},
});
