import { useEffect } from 'react';

import TaskManagerService from '@/services/location/taskManager';
import { LocationType } from '@/stores/location';

type Props = {
	destination: LocationType;
	origin: LocationType;
};

const locationTaskManager = new TaskManagerService('location-tracking');

function Directions({ destination, origin }: Props) {
	useEffect(() => {
		locationTaskManager.startTask();

		// Clean up: Stop the background task when the component unmounts
		return () => {
			locationTaskManager.stopTask();
		};
	}, []);

	return <>{/* <Route origin={origin} destination={destination} /> */}</>;
}

export default Directions;
