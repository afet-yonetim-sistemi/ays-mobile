import { LocationObject } from 'expo-location';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import MapView from 'react-native-maps';

import { darkStyle } from '@/constants/mapStyle';
import { locationService } from '@/services/location';

function HomeMap() {
	const mapRef = useRef<MapView>(null);
	const [location, setLocation] = useState<LocationObject | null>(null);
	const { colorScheme } = useColorScheme();

	const getLocation = async () => {
		const location = await locationService.getCurrentLocation();
		setLocation(location);
	};

	const animateToLocation = () => {
		if (mapRef.current && location) {
			mapRef.current.animateCamera(
				{
					center: {
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
					},
					zoom: 15,
					altitude: 1000,
				},
				{ duration: 1000 }
			);
		}
	};

	// get user location
	useEffect(() => {
		getLocation();
	}, []);

	useEffect(() => {
		if (location && mapRef.current) {
			animateToLocation();
		}
	}, [location]);

	return (
		<>
			{/* <View className="bottom-12 left-3 absolute z-10 h-20 w-20">
        <IconButton
          mode="contained"
          icon="menu"
          size={25}
          containerColor={Colors.secondary[500]}
          iconColor="white"
          onPress={onZoomInPress}
        />
      </View> */}
			<MapView
				className="w-full h-full"
				ref={mapRef}
				showsUserLocation
				zoomEnabled
				minZoomLevel={1}
				maxZoomLevel={15}
				customMapStyle={colorScheme === 'dark' ? darkStyle : undefined}
				showsMyLocationButton={false}
			>
				{/* {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Konumum"
            description="Konumum"
          />
        )} */}
			</MapView>
		</>
	);
}

export default HomeMap;
