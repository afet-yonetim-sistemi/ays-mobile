import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { LocationType, LocationWithDistance } from '@/stores/ui';

class LocationService {
	public async checkLocationPermission() {
		const { status } = await Location.requestForegroundPermissionsAsync();
		return status === 'granted';
	}

	public async getCurrentLocation() {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				return null;
			}
			const location = await Location.getCurrentPositionAsync({});
			return location;
		} catch (err) {
			console.log('getCurrentLocation', err);
			return null;
		}
	}

	public findDistancesForLocation(location: LocationType, coordinates: LocationType[] = []) {
		const distances: LocationWithDistance[] = coordinates
			.map((coordinate) => {
				const distance = getDistance(location, coordinate);
				return {
					...coordinate,
					distance,
				};
			})
			.filter((location) => location.distance < 50);

		console.log(
			'findDistancesForLocation',
			distances.map((d) => d.distance)
		);
		return !!distances.length;
	}
}

export const centerOfTurkey = {
	latitude: 39.92077,
	longitude: 32.85411,
};

export const locationService = new LocationService();
