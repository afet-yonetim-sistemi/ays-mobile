import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperTheme } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

import Colors from './Colors';

const lightTheme: ThemeProp = {
	...PaperTheme,
	colors: {
		primary: Colors.primary[500],
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(217, 226, 255)',
		onPrimaryContainer: 'rgb(0, 25, 69)',
		secondary: 'rgb(35, 95, 166)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(213, 227, 255)',
		onSecondaryContainer: 'rgb(0, 27, 59)',
		tertiary: 'rgb(114, 85, 114)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(253, 215, 250)',
		onTertiaryContainer: 'rgb(42, 19, 44)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(254, 251, 255)',
		onBackground: 'rgb(27, 27, 31)',
		surface: 'rgb(254, 251, 255)',
		onSurface: 'rgb(27, 27, 31)',
		surfaceVariant: 'rgb(225, 226, 236)',
		onSurfaceVariant: 'rgb(68, 70, 79)',
		outline: 'rgb(117, 119, 128)',
		outlineVariant: 'rgb(197, 198, 208)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(48, 48, 52)',
		inverseOnSurface: 'rgb(242, 240, 244)',
		inversePrimary: 'rgb(176, 198, 255)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(241, 243, 252)',
			level2: 'rgb(234, 238, 251)',
			level3: 'rgb(226, 233, 249)',
			level4: 'rgb(224, 231, 249)',
			level5: 'rgb(218, 228, 248)',
		},
		surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
		onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
		backdrop: 'rgba(46, 48, 56, 0.4)',
	},
};

const darkTheme: ThemeProp = {
	...PaperDarkTheme,
	colors: {
		...lightTheme.colors,
		secondary: 'rgb(167, 200, 255)',
		onSecondary: 'rgb(0, 48, 96)',
		secondaryContainer: 'rgb(0, 71, 136)',
		onSecondaryContainer: 'rgb(213, 227, 255)',
		tertiary: 'rgb(224, 187, 222)',
		onTertiary: 'rgb(65, 39, 66)',
		tertiaryContainer: 'rgb(89, 61, 90)',
		onTertiaryContainer: 'rgb(253, 215, 250)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(22, 27, 31)',
		onBackground: 'rgb(227, 226, 230)',
		surface: 'rgb(27, 27, 31)',
		onSurface: 'rgb(227, 226, 230)',
		surfaceVariant: 'rgb(68, 70, 79)',
		onSurfaceVariant: 'rgb(197, 198, 208)',
		outline: '#355780',
		outlineVariant: 'rgb(68, 70, 79)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(227, 226, 230)',
		inverseOnSurface: 'rgb(48, 48, 52)',
		inversePrimary: 'rgb(0, 88, 203)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(34, 36, 42)',
			level2: 'rgb(39, 41, 49)',
			level3: 'rgb(43, 46, 56)',
			level4: 'rgb(45, 48, 58)',
			level5: 'rgb(48, 51, 62)',
		},
		surfaceDisabled: 'rgba(227, 226, 230, 0.12)',
		onSurfaceDisabled: 'rgba(227, 226, 230, 0.38)',
		backdrop: 'rgba(46, 48, 56, 0.4)',
	},
};

const navigationDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: Colors.secondary[500],
		card: Colors.secondary[500],
		primary: Colors.primary[600],
	},
};

const navigationLightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: Colors.primary[500],
	},
};

export { darkTheme, lightTheme, navigationDarkTheme, navigationLightTheme };
