import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import MapDirections from '@/components/map/directions/MapDirections';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { locationService } from '@/services/location';
import {
	AssignmentStatus,
	AssignmentTracking,
	assignmentAtom,
	assignmentTrackingAtom,
} from '@/stores/assignment';
import { LocationType, locationAtom } from '@/stores/location';

export default function Route() {
	const assignment = useAtomValue(assignmentAtom);

	const location = useAtomValue(locationAtom);
	const setAssignmentTracking = useSetAtom(assignmentTrackingAtom);
	const [directionCoordinates, setDirectionCoordinates] = useState<LocationType[]>([]);

	const isOnTheLine = useDebouncedCallback(async () => {
		console.log('isOnTheLine called', location);
		if (!location) return false;
		if (assignment?.status === AssignmentStatus.IN_PROGRESS) {
			await locationService.setUserLocation(location);
		}
		if (directionCoordinates.length > 0) {
			const inLine = locationService.findDistancesForLocation(location, directionCoordinates);
			console.log('on the line', inLine);
			if (!inLine) {
				await locationService.setUserLocation(location);
				await setAssignmentTracking((prev: AssignmentTracking) => ({
					...prev,
					origin: location,
				}));
			}
			await setAssignmentTracking((prev: AssignmentTracking) => ({
				...prev,
			}));
		}
	}, 1250);

	const setDetail = async (detail: AssignmentTracking['detail']) => {
		console.log('setDetail called');
		await setAssignmentTracking((prev: AssignmentTracking) => ({
			...prev,
			detail,
		}));
	};

	useEffect(() => {
		if (location) isOnTheLine();
	}, [location]);

	return <MapDirections setDirectionCoordinates={setDirectionCoordinates} setDetail={setDetail} />;
}
