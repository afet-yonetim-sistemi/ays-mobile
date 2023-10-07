// CustomDrawer.tsx
import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';

import { useHeights } from '@/hooks/useHeights';
import Footer from '@/screens/drawer/Footer';
import ProfileArea from '@/screens/drawer/ProfileArea';

type Props = DrawerContentComponentProps & object;

const CustomDrawer: React.FC<Props> = (props) => {
	const { statusBarHeight, bottomTabBarHeight } = useHeights();
	const marginBottom = bottomTabBarHeight ? bottomTabBarHeight - 8 : 8;

	return (
		<View
			className="flex-1"
			style={{
				marginBottom,
				marginTop: statusBarHeight,
			}}
		>
			<ProfileArea />
			<Divider />
			<View className="flex-1 my-2">
				<DrawerItemList {...props} />
			</View>
			<Divider />
			<Footer />
		</View>
	);
};

export default CustomDrawer;
