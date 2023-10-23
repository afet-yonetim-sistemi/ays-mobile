import { useEffect } from 'react';

import Route from '@/components/map/directions/Route';
import TaskManagerService from '@/services/location/taskManager';

const locationTaskManager = new TaskManagerService('location-tracking');

function Directions() {
	useEffect(() => {
		console.log('TaskManagerService started');
		locationTaskManager.startTask();

		// Clean up: Stop the background task when the component unmounts
		return () => {
			console.log('TaskManagerService unmounted');
			locationTaskManager.stopTask();
		};
	}, []);

	return <Route />;
}

export default Directions;
