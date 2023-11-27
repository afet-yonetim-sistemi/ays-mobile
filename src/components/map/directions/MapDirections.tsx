import { useAtomValue } from 'jotai';
import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import MapViewDirections, { MapDirectionsResponse } from 'react-native-maps-directions';

import Colors from '@/constants/Colors';
import ENV from '@/constants/env';
import { AssignmentTracking, destinationAtom, originAtom } from '@/stores/assignment';

type Props = {
	setDirectionCoordinates: (_: any) => void;
	setDetail: (_value: AssignmentTracking['detail']) => void;
};

export default function MapDirections({ setDirectionCoordinates, setDetail }: Props) {
	const origin = useAtomValue(originAtom);
	const destination = useAtomValue(destinationAtom);

	const onReady = (result: MapDirectionsResponse) => {
		console.log('onReady called');
		setDetail(result.legs[0]);
		setDirectionCoordinates(result.coordinates);
	};

	const onError = (errorMessage: string) => {
		Alert.alert(errorMessage);
	};

	const renderMap = useCallback(() => {
		if (!origin) {
			return null;
		}

		return (
			<MapViewDirections
				origin={origin}
				destination={destination}
				// waypoints={wayPoints}
				apikey={ENV.GOOGLE_API_KEY}
				strokeWidth={7}
				strokeColor={Colors.primary[500]}
				mode="DRIVING"
				onReady={onReady}
				onError={onError}
				precision="high"
				resetOnChange
				lineDashPhase={10}
				optimizeWaypoints
			/>
		);
	}, [origin, destination]);

	return renderMap();
}
