import { selectAtom } from 'jotai/utils';

import { atomWithAsyncStorage } from '@/stores/index';
import { LocationType } from '@/stores/location';
import { Assignment } from '@/types/index';

export type AssignmentTracking = {
	collectedLocations: LocationType[];
	isStarted: boolean;
	isFinished: boolean;
	assignment: Assignment | null;
};

export const defaultAssignmentTracking: AssignmentTracking = {
	collectedLocations: [],
	isStarted: false,
	isFinished: false,
	assignment: null,
};

export const assignmentTrackingAtom = (
	id: string,
	value: AssignmentTracking = defaultAssignmentTracking
) => {
	return atomWithAsyncStorage<AssignmentTracking>(`assignment-tracking-${id}`, value);
};

export const assignmentAtom = (id: string) =>
	selectAtom(assignmentTrackingAtom(id), (p) => p.assignment);
