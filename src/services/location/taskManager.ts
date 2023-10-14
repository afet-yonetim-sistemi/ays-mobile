import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getDefaultStore } from 'jotai';

import { locationAtom } from '@/stores/location';

const store = getDefaultStore();

class TaskManagerService {
	private taskName: string;

	constructor(taskName: string) {
		this.taskName = taskName;
		this.registerTask();
	}

	// Register the background task with the specified name
	registerTask = (): void => {
		TaskManager.defineTask(this.taskName, async ({ data, error }) => {
			if (error) {
				console.error(`Error in background task '${this.taskName}':`, error);
				return;
			}

			if (data) {
				console.log(`Received data for task '${this.taskName}':`, data);
				const oldLocation = store.get(locationAtom);
				const { locations } = data as any;
				const lat = locations[0].coords.latitude;
				const long = locations[0].coords.longitude;
				if (oldLocation) {
					const oldLat = oldLocation?.latitude;
					const oldLong = oldLocation?.latitude;
					if (oldLong === long && oldLat === lat) {
						return;
					}
				}
				store.set(locationAtom, {
					latitude: lat,
					longitude: long,
				});
			}
		});
	};

	// Start the background task
	startTask = async (): Promise<void> => {
		const isRegistered = await TaskManager.isTaskRegisteredAsync(this.taskName);

		if (!isRegistered) {
			this.registerTask();
		}

		try {
			// Start the background task with the specified name
			await Location.startLocationUpdatesAsync(this.taskName, {
				accuracy: Location.Accuracy.Balanced,
				timeInterval: 1000,
				distanceInterval: 10,
				deferredUpdatesInterval: 300000,
				deferredUpdatesDistance: 30,
				pausesUpdatesAutomatically: false,
			});

			console.log(`Background task '${this.taskName}' started.`);
		} catch (error) {
			console.error(`Error starting background task '${this.taskName}':`, error);
		}
	};

	// Stop the background task
	stopTask = async (): Promise<void> => {
		try {
			// Stop the background task with the specified name
			await Location.stopLocationUpdatesAsync(this.taskName);
			console.log(`Background task '${this.taskName}' stopped.`);
		} catch (error) {
			console.error(`Error stopping background task '${this.taskName}':`, error);
		}
	};
}

export default TaskManagerService;
