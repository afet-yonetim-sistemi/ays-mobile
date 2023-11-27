import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomDrawer from 'src/screens/drawer';

import { assignmentService } from '@/services/assignment';

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: '(home)',
};

export default function TabLayout() {
	const { t } = useTranslation();

	const getAssignmentSummary = async () => {
		await assignmentService.getAssignmentSummary();
	};

	useEffect(() => {
		getAssignmentSummary();
	}, []);
	return (
		<Drawer
			screenOptions={{ headerShown: false }}
			drawerContent={(props) => <CustomDrawer {...props} />}
			defaultStatus="closed"
		>
			<Drawer.Screen
				name="(home)"
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
