import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import HomeMap from 'src/screens/home/HomeMap';
import LocationNotAllowed from 'src/screens/home/LocationNotAllowed';

import Colors from '@/constants/Colors';
import UserAgreementNotAllowed from '@/screens/home/UserAgreementNotAllowed';
import { permissionsAtom, userAgreementAtom } from '@/stores/permissions';

export default function ModalScreen() {
	const navigation = useNavigation();
	const permissions = useAtomValue(permissionsAtom);
	const userAgreement = useAtomValue(userAgreementAtom);
	const toggleDrawer = () => {
		navigation.dispatch(DrawerActions.openDrawer());
	};

	const isMapAccessible = useMemo(
		() => permissions.location && userAgreement.accepted,
		[permissions, userAgreement]
	);

	return (
		<View className="flex flex-1 items-center justify-center h-full">
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
	);
}
