module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
		plugins: [
			// Required for expo-router
			'expo-router/babel',
			'react-native-reanimated/plugin',
			'react-native-paper/babel',
			'nativewind/babel',
			[
				'module-resolver',
				{
					alias: {
						'@/': './src',
						'@/stores': './src/stores',
						'@/contexts': './src/contexts',
						'@/constants': './src/constants',
						'@/types': './src/types',
						'@/components': './src/components',
						'@/services': './src/services',
						'@/hooks': './src/hooks',
						'@/assets': './assets',
					},
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			],
		],
	};
};
