import * as Location from 'expo-location';

class LocationService {
	public async checkLocationPermission() {
		const { status } = await Location.requestForegroundPermissionsAsync();
		return status === 'granted';
	}

	public async getCurrentLocation() {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			return null;
		}
		const location = await Location.getCurrentPositionAsync({});
		return location;
	}
}

export const centerOfTurkey = {
	latitude: 39.92077,
	longitude: 32.85411,
};

export const locationService = new LocationService();
