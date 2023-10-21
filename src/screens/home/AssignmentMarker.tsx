import { useAtomValue } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Marker } from 'react-native-maps';

import { locationService } from '@/services/location';
import { assignmentAtom } from '@/stores/assignment';

export default function AssignmentMarker() {
	const assignment = useAtomValue(assignmentAtom);
	const [title, setTitle] = useState<string | null>(null);
	const coordinates = useMemo(() => {
		return {
			latitude: assignment?.location?.latitude || 0,
			longitude: assignment?.location?.longitude || 0,
		};
	}, [assignment]);

	const getReverseGeocoding = async () => {
		if (assignment?.location) {
			const data = await locationService.reverseGeocoding(assignment?.location);
			setTitle(data);
			console.log('reverseGeocoding', data);
		}
	};

	useEffect(() => {
		getReverseGeocoding();
	}, [assignment]);

	// if (assignment?.location === undefined) return null;

	return (
		<Marker
			coordinate={coordinates}
			className="bg-red-500"
			style={{
				backgroundColor: 'red',
			}}
			title={title || ''}
		/>
	);
}
