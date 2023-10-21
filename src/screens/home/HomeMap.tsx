import { useAtomValue } from 'jotai';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

import Directions from '@/components/map/directions';
import { darkStyle } from '@/constants/mapStyle';
import AssignmentControls from '@/screens/home/AssignmentControls';
import AssignmentMarker from '@/screens/home/AssignmentMarker';
import { centerOfTurkey } from '@/services/location';
import { AssignmentStatus, assignmentAtom } from '@/stores/assignment';
import { locationAtom } from '@/stores/location';

// const iosOrigin = {
// 	longitude: -122.03272188,
// 	latitude: 37.33500926,
// };
// const iosDest = { latitude: 37.36488463, longitude: -122.12699926 };

// const androidOrigin = {
// 	// latitude: 39.922,
// 	// longitude: 32.8513,
// 	// latitude: 39.9823219,
// 	// longitude: 32.617823,
// 	latitude: 39.9824,
// 	longitude: 32.6256,
// };
// const androidDest = {
// 	latitude: 39.97612858457146,
// 	longitude: 32.602658887941054,
// };

function HomeMap() {
	const assignment = useAtomValue(assignmentAtom);
	const [mapZoom, setMapZoom] = useState<number>(15);
	const [_locationStarted] = useState(false);
	const location = useAtomValue(locationAtom);
	const mapRef = useRef<MapView>(null);
	const { colorScheme } = useColorScheme();

	const animateToLocation = () => {
		if (mapRef.current && location) {
			mapRef.current.animateCamera(
				{
					center: {
						latitude: location.latitude,
						longitude: location.longitude,
					},
					zoom: mapZoom,
					altitude: 5000,
				},
				{ duration: 1000 }
			);
		}
	};

	useEffect(() => {
		if (mapRef.current) {
			if (assignment?.location) {
				const { latitude, longitude } = assignment.location;
				if (latitude && longitude) {
					mapRef.current.animateCamera(
						{
							center: {
								latitude,
								longitude,
							},
							zoom: mapZoom,
							altitude: 10000,
						},
						{ duration: 1000 }
					);
				} else {
					animateToLocation();
				}
			} else {
				animateToLocation();
			}
		}
	}, [assignment]);

	useEffect(() => {
		animateToLocation();
	}, []);

	useEffect(() => {
		if (assignment?.status === AssignmentStatus.IN_PROGRESS) {
			animateToLocation();
		}
	}, [assignment, location]);

	return (
		<>
			<AssignmentControls />
			<View className="flex flex-1 bg-blue-300 w-full h-full">
				<MapView
					className="w-full h-full z-10"
					ref={mapRef}
					showsUserLocation
					zoomEnabled
					showsIndoors
					zoomTapEnabled
					minZoomLevel={1}
					maxZoomLevel={20}
					customMapStyle={colorScheme === 'dark' ? darkStyle : undefined}
					showsMyLocationButton={false}
					provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
					zoomControlEnabled={false}
					initialRegion={{
						latitude: location?.latitude || centerOfTurkey.latitude,
						longitude: location?.longitude || centerOfTurkey.longitude,
						latitudeDelta: 0.0622,
						longitudeDelta: 0.0121,
					}}
					onRegionChangeComplete={async () => {
						const coords = await mapRef?.current?.getCamera();
						coords?.zoom && setMapZoom(coords?.zoom);
					}}
				>
					<AssignmentMarker />
					<Directions />
				</MapView>
			</View>
		</>
	);
}

export default HomeMap;
