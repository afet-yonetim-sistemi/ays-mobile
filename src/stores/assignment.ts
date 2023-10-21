import { selectAtom } from 'jotai/utils';

import { atomWithAsyncStorage } from '@/stores/index';
import { LocationType } from '@/stores/location';
import { Assignment } from '@/types';

export enum AssignmentStatus {
	AVAILABLE = 'AVAILABLE',
	RESERVED = 'RESERVED',
	ASSIGNED = 'ASSIGNED',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE',
}

type ATAssignment =
	| (Assignment & {
			status: AssignmentStatus;
			location: LocationType;
	  })
	| null;

export type AssignmentTracking = {
	origin: LocationType | null;
	collectedLocations: LocationType[] &
		{
			isSent: boolean;
			date: Date;
		}[];
	wayPoints: LocationType[];
	assignment: ATAssignment;
	isLoading: boolean;
};

export const defaultAssignmentTracking: AssignmentTracking = {
	origin: null,
	collectedLocations: [],
	wayPoints: [],
	assignment: null,
	isLoading: false,
};

export const assignmentTrackingAtom = atomWithAsyncStorage<AssignmentTracking>(
	`assignment-tracking-atom`,
	defaultAssignmentTracking
);

export const originAtom = selectAtom(assignmentTrackingAtom, (p) => p.origin);

export const assignmentAtom = selectAtom(assignmentTrackingAtom, (p) => p.assignment);
export const destinationAtom = selectAtom(assignmentTrackingAtom, (p) => p.assignment?.location);
export const wayPointsAtom = selectAtom(assignmentTrackingAtom, (p) => p.wayPoints);
export const isLoadingAtom = selectAtom(assignmentTrackingAtom, (p) => p.isLoading);
