import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import CustomDrawer from 'src/screens/drawer';

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'settings',
};

export default function TabLayout() {
	const { t } = useTranslation();
	return (
		<Drawer
			screenOptions={{ headerShown: false }}
			drawerContent={(props) => <CustomDrawer {...props} />}
			defaultStatus="closed"
		>
			<Drawer.Screen
				name="index"
				options={{
					title: t('screens.home.title'),
				}}
			/>
			<Drawer.Screen
				name="(settings)"
				options={{
					title: t('screens.settings.title'),
				}}
			/>
		</Drawer>
	);
}
