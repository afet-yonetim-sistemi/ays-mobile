import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import CustomDrawer from 'src/screens/drawer';

export default function TabLayout() {
	const { t } = useTranslation();
	return (
		<Drawer
			screenOptions={{ headerShown: false }}
			drawerContent={(props) => <CustomDrawer {...props} />}
		>
			<Drawer.Screen
				name="index"
				options={{
					title: t('screens.home'),
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
