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
import { AssignmentStatus, assignmentAtom, originAtom } from '@/stores/assignment';
import { locationAtom } from '@/stores/location';

function HomeMap() {
	const assignment = useAtomValue(assignmentAtom);
	const origin = useAtomValue(originAtom);
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
			if (assignment?.location && origin) {
				const { latitude, longitude } = assignment.location;
				// Set up your map component
				if (latitude && longitude) {
					console.log('fitting');
					mapRef.current.fitToCoordinates([origin, assignment.location]);
				} else {
					console.log('animating else');
					animateToLocation();
				}
			} else {
				animateToLocation();
				console.log('animating else 2');
			}
		}
	}, [assignment, origin]);

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
						console.log('new zoom level: ', coords?.zoom);
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
