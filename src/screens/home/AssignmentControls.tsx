import { AntDesign } from '@expo/vector-icons';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useHeights } from '@/hooks/useHeights';
import { AssignmentProcess, assignmentService } from '@/services/assignment';
import { authService } from '@/services/auth';
import {
	AssignmentStatus,
	AssignmentTracking,
	assignmentAtom,
	assignmentTrackingAtom,
	defaultAssignmentTracking,
	isDetailOpenAtom,
	isLoadingAtom,
	isWaitingForConfirmationAtom,
} from '@/stores/assignment';
import { locationAtom } from '@/stores/location';
import { snackbarAtom } from '@/stores/ui';

const AssignmentControls = () => {
	const setSnackbar = useSetAtom(snackbarAtom);
	const { bottomTabBarHeight } = useHeights();
	const assignment = useAtomValue(assignmentAtom);
	const isLoading = useAtomValue(isLoadingAtom);
	const setAssignmentTracking = useSetAtom(assignmentTrackingAtom);
	const location = useAtomValue(locationAtom);
	const isWaitingForConfirmation = useAtomValue(isWaitingForConfirmationAtom);
	const isDetailOpen = useAtomValue(isDetailOpenAtom);
	const { t } = useTranslation();
	const { user, updateProfile } = useAuth();
	const userIsAvailable = useMemo(() => {
		return (
			user?.supportStatus === 'READY' ||
			(assignment && user?.supportStatus && ['BUSY', 'ON_ROAD'].includes(user?.supportStatus))
		);
	}, [user]);

	const isInfoVisible = useMemo(() => {
		if (!assignment?.status) return false;
		return [AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS].includes(assignment?.status);
	}, [assignment]);

	const onSearch = useCallback(async () => {
		try {
			if (location) {
				const { response } = await assignmentService.searchAssignment({
					latitude: location.latitude,
					longitude: location.longitude,
				});
				if (response) {
					await setAssignmentTracking((prev: AssignmentTracking) => ({
						...prev,
						origin: location,
						isWaitingForConfirmation: true,
						assignment: {
							...response,
							status: AssignmentStatus.RESERVED,
						},
					}));
				}
			} else {
				console.log('no location');
			}
		} catch (error: any) {
			setSnackbar({
				visible: true,
				message: error.message ?? t('errors.unknown'),
				severity: 'error',
			});
		}
	}, [location]);

	const onStart = async () => {
		try {
			await assignmentService.processAssignment(AssignmentProcess.Start);
			await setAssignmentTracking((prev: AssignmentTracking) => ({
				...prev,
				origin: location,
				assignment: {
					...prev.assignment,
					status: AssignmentStatus.IN_PROGRESS,
				},
			}));
		} catch (error: any) {
			console.log('onStart errored', error);
			setSnackbar({
				visible: true,
				message: error.message ?? t('errors.unknown'),
				severity: 'error',
			});
			await setAssignmentTracking((prev: AssignmentTracking) => ({
				...prev,
				assignment: null,
			}));
		}
	};

	const onComplete = async () => {
		try {
			await assignmentService.processAssignment(AssignmentProcess.Complete);
			await setAssignmentTracking(defaultAssignmentTracking);
			Alert.alert('Teşekkürler', 'İyi bir iş başardınız');
		} catch (error: any) {
			console.log('onComplete errored', error);
			console.log('onStart errored', error);
			setSnackbar({
				visible: true,
				message: error.message ?? t('errors.unknown'),
				severity: 'error',
			});
		}
	};

	const onReady = async () => {
		await setAssignmentTracking((prev: any) => {
			return { ...prev, isLoading: true };
		});
		await authService.setUserSelfStatus({
			supportStatus: 'READY',
		});
		await updateProfile();
		await setAssignmentTracking((prev: any) => {
			return { ...prev, isLoading: false };
		});
	};

	const openAssignmentSheet = async () => {
		if (assignment) {
			await setAssignmentTracking((prev: any) => {
				return { ...prev, isDetailOpen: true };
			});
		}
	};

	const renderIcon = useCallback(
		(props: Partial<IconProps> & { color: string }) => {
			if (isLoading) {
				return <ActivityIndicator animating color="white" />;
			}
			if (!userIsAvailable) return <AntDesign {...props} name="clockcircleo" />;
			if (!assignment) {
				return <AntDesign {...props} name="search1" />;
			}
			if (assignment.status === AssignmentStatus.ASSIGNED) {
				return <AntDesign {...props} name="playcircleo" />;
			}
			if (assignment.status === AssignmentStatus.IN_PROGRESS) {
				return <AntDesign {...props} name="checkcircleo" />;
			}
		},
		[assignment, isLoading, userIsAvailable]
	);

	const className: string = useMemo(() => {
		if (!userIsAvailable) return 'bg-yellow-500';
		if (!assignment) {
			return 'bg-primary-500';
		}
		switch (assignment.status) {
			case AssignmentStatus.ASSIGNED:
				return 'bg-blue-500';
			case AssignmentStatus.IN_PROGRESS:
				return 'bg-green-500';
			default:
				return 'bg-secondary-500';
		}
	}, [assignment, userIsAvailable]);

	const buttonAction = useCallback(() => {
		if (!userIsAvailable) return onReady();
		if (assignment) {
			switch (assignment.status) {
				case AssignmentStatus.ASSIGNED:
					onStart();
					break;
				case AssignmentStatus.IN_PROGRESS:
					onComplete();
					break;
				default:
					break;
			}
		} else {
			onSearch();
		}
	}, [assignment, setAssignmentTracking, onSearch, onComplete, onStart]);

	const isButtonVisible = useMemo(() => {
		if (isWaitingForConfirmation || isDetailOpen) return false;

		if (assignment && assignment.status === AssignmentStatus.RESERVED) {
			return false;
		}
		return true;
	}, [assignment, isWaitingForConfirmation, isDetailOpen]);

	const buttonText = useMemo(() => {
		if (!userIsAvailable) return t('screens.home.userSupportStatus.beReady');
		if (assignment) {
			switch (assignment.status) {
				case AssignmentStatus.ASSIGNED:
					return t('screens.home.assignmentControls.startAssignment');
				case AssignmentStatus.IN_PROGRESS:
					return t('screens.home.assignmentControls.completeAssignment');
				default:
					return t('screens.home.assignmentControls.searchAssignment');
			}
		}
		return t('screens.home.assignmentControls.searchAssignment');
	}, [assignment, t, userIsAvailable]);

	if (!isButtonVisible) return null;

	return (
		<View
			className="bottom-0 absolute z-10 flex items-center flex-row"
			style={{
				paddingBottom: bottomTabBarHeight,
			}}
		>
			<Button
				mode="contained"
				icon={(props) => renderIcon({ ...props, size: 24, color: 'white' })}
				onPress={buttonAction}
				className={className + ' android:mb-2'}
			>
				<Text className="text-white font-bold text-base pl-5">{buttonText}</Text>
			</Button>
			{isInfoVisible && (
				<IconButton
					mode="contained"
					icon={(props) => <AntDesign {...props} name="infocirlceo" size={24} color="white" />}
					onPress={openAssignmentSheet}
					className="bg-secondary-500 android:mb-2"
				/>
			)}
		</View>
	);
};

export default AssignmentControls;
