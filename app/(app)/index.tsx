import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import HomeMap from 'src/screens/home/HomeMap';
import LocationNotAllowed from 'src/screens/home/LocationNotAllowed';

import Colors from '@/constants/Colors';
import AssignmentSheet from '@/screens/home/AssignmentSheet';
import UserAgreementNotAllowed from '@/screens/home/UserAgreementNotAllowed';
import { locationService } from '@/services/location';
import { locationAtom } from '@/stores/location';
import { permissionsAtom, userAgreementAtom } from '@/stores/permissions';

export default function ModalScreen() {
	const navigation = useNavigation();
	const permissions = useAtomValue(permissionsAtom);
	const [location, setLocation] = useAtom(locationAtom);
	const userAgreement = useAtomValue(userAgreementAtom);
	const toggleDrawer = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};

	const isMapAccessible = useMemo(
		() => permissions.location && userAgreement.accepted && location,
		[permissions, userAgreement, location]
	);

	const getLocation = async () => {
		const location = await locationService.getCurrentLocation();
		if (location) {
			setLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		}
	};

	useEffect(() => {
		getLocation();
	}, []);
	return (
		<GestureHandlerRootView className="flex-1 flex-grow">
			<View className="flex flex-1 items-center justify-center h-full relative">
				<View className="top-12 left-3 absolute z-10 h-20 w-20">
					<IconButton
						mode="contained"
						icon="menu"
						size={25}
						containerColor={Colors.secondary[500]}
						iconColor="white"
						onPress={toggleDrawer}
					/>
				</View>
				{isMapAccessible && <HomeMap />}
				<UserAgreementNotAllowed />
				<LocationNotAllowed />
			</View>
			<AssignmentSheet />
		</GestureHandlerRootView>
	);
}
