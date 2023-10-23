import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { getDefaultStore } from 'jotai';

import { userLocationUrl } from '@/services/endpoints';
import { LocationType, LocationWithDistance, locationAtom } from '@/stores/location';
import { axiosInstance } from '@/utils/axiosInstance';

const store = getDefaultStore();
class LocationService {
	public async checkLocationPermission() {
		const { status } = await Location.requestForegroundPermissionsAsync();
		console.log('status: ' + status);
		return status === 'granted';
	}

	public async checkBackgroundPermission() {
		const { status } = await Location.requestBackgroundPermissionsAsync();
		console.log('status:' + status);
		return status === 'granted';
	}

	public async getCurrentLocation() {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				return null;
			}

			const location = await Location.getCurrentPositionAsync({});
			await store.set(locationAtom, {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
			return location;
		} catch (err) {
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

		return !!distances.length;
	}

	public getDistanceToLocation(location: LocationType, destination: LocationType): number {
		return getDistance(location, destination);
	}

	async setUserLocation(location: LocationType) {
		try {
			console.log('Updating new location for assignment:', location);
			await axiosInstance.post(userLocationUrl, location);
		} catch (error) {
			console.log('error', error);
		}
	}

	async reverseGeocoding(location: LocationType) {
		const locations = await Location.reverseGeocodeAsync(location);
		if (locations.length > 0) {
			const firstLocation = locations[0];
			const formattedAddress = `${firstLocation.street}, ${firstLocation.city}, ${firstLocation.region}, ${firstLocation.country}, ${firstLocation.postalCode}`;
			return formattedAddress;
		}
		return null;
	}
}

export const centerOfTurkey = {
	latitude: 39.92077,
	longitude: 32.85411,
};

export const locationService = new LocationService();
