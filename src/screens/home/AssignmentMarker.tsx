import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import { Divider, Text } from 'react-native-paper';
import colors from 'tailwindcss/colors';

import Colors from '@/constants/Colors';
import useAppearance from '@/hooks/useAppearance';
import { assignmentAtom, detailAtom } from '@/stores/assignment';

export default function AssignmentMarker() {
	const assignment = useAtomValue(assignmentAtom);
	const detail = useAtomValue(detailAtom);
	const [title, setTitle] = useState<string | null>(null);
	const coordinates = useMemo(() => {
		return {
			latitude: assignment?.location?.latitude || 0,
			longitude: assignment?.location?.longitude || 0,
		};
	}, [assignment]);

	useEffect(() => {
		setTitle(detail?.end_address ?? '');
	}, [detail]);

	const iconColor = useAppearance(Colors.secondary[500], colors.rose[500]);

	if (assignment?.location === undefined) return null;

	return (
		<Marker id={assignment?.id ?? undefined} coordinate={coordinates}>
			<MaterialIcons name="location-pin" size={40} color={iconColor} />

			{title && (
				<Callout
					id={assignment?.id ?? undefined}
					style={{
						width: Dimensions.get('window').width * 0.8,
					}}
					tooltip
				>
					<View className="flex w-full bg-[#f7f7fa] android:bg-white dark:bg-secondary-600 rounded-xl shadow shadow-gray-300 dark:shadow-slate-800 p-2 android:shadow-gray-900">
						<Text className="font-bold">Adres</Text>
						<Divider className="my-2" />
						<Text className="mb-2">{title}</Text>
					</View>
				</Callout>
			)}
		</Marker>
	);
}
