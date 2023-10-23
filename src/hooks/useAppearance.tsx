import { useColorScheme } from 'nativewind';

export default function useAppearance(lightValue: string, darkValue: string) {
	const { colorScheme } = useColorScheme();
	return colorScheme === 'dark' ? darkValue : lightValue;
}
