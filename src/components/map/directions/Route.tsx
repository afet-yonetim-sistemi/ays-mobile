import { useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import MapViewDirections, { MapDirectionsResponse } from 'react-native-maps-directions';

import Colors from '@/constants/Colors';
import ENV from '@/constants/env';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { locationService } from '@/services/location';
import { LocationType, locationAtom } from '@/stores/location';

type Props = {
	destination: LocationType;
	origin: LocationType;
};
export default function Route({ origin, destination }: Props) {
	const location = useAtomValue(locationAtom);
	const [directionCoordinates, setDirectionCoordinates] = useState<LocationType[]>([]);
	const [wayPoints, setWayPoints] = useState<LocationType[]>([]);

	const isOnTheLine = useDebouncedCallback(() => {
		if (!location) return false;
		if (directionCoordinates.length > 0) {
			const inLine = locationService.findDistancesForLocation(location, directionCoordinates);
			console.log('on the line', inLine);
			if (!inLine) {
				setWayPoints([location]);
			}
		}
	}, 1000);

	useEffect(() => {
		if (location && directionCoordinates.length) isOnTheLine();
	}, [location, directionCoordinates, isOnTheLine]);
	const onReady = (result: MapDirectionsResponse) => {
		setDirectionCoordinates(result.coordinates);
	};

	const onError = (errorMessage: string) => {
		Alert.alert(errorMessage);
	};

	return (
		<MapViewDirections
			origin={origin}
			destination={destination}
			waypoints={wayPoints}
			apikey={ENV.GOOGLE_API_KEY}
			strokeWidth={7}
			strokeColor={Colors.primary[500]}
			mode="DRIVING"
			onReady={onReady}
			onError={onError}
			precision="high"
			resetOnChange
		/>
	);
}
