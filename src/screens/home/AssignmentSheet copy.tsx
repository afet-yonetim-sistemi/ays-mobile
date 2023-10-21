import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CircularProgress, { ProgressRef } from 'react-native-circular-progress-indicator';
import { Button, Divider } from 'react-native-paper';

import StyledBottomSheet from '@/components/CustomBottomSheet';
import { useHeights } from '@/hooks/useHeights';
import { AssignmentProcess, assignmentService } from '@/services/assignment';
import {
	AssignmentStatus,
	AssignmentTracking,
	assignmentAtom,
	assignmentTrackingAtom,
	defaultAssignmentTracking,
	isLoadingAtom,
} from '@/stores/assignment';
import { locationAtom } from '@/stores/location';

const TIMEOUT_SECONDS = 5;

const AssignmentSheet = () => {
	const assignment = useAtomValue(assignmentAtom);
	const location = useAtomValue(locationAtom);
	const isLoading = useAtomValue(isLoadingAtom);
	const setAssignmentTracking = useSetAtom(assignmentTrackingAtom);
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['30%', '50%', '85%'], []);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	const { bottomTabBarHeight } = useHeights();
	const progressRef = useRef<ProgressRef>(null);
	const { colorScheme } = useColorScheme();

	useLayoutEffect(() => {
		if (progressRef.current) {
			progressRef.current.reAnimate();
		}
	}, []);

	useLayoutEffect(() => {
		if (progressRef.current && assignment) {
			progressRef.current.reAnimate();
		}
		if (bottomSheetRef.current) {
			if (assignment === null) {
				bottomSheetRef.current.close();
			}
		}
	}, [assignment]);

	const onApprove = async () => {
		try {
			if (progressRef.current) {
				progressRef.current?.pause();
			}
			if (assignment && sheetVisible) {
				await assignmentService.processAssignment(AssignmentProcess.Approve);
				setAssignmentTracking((prev: AssignmentTracking) => ({
					...prev,
					origin: location,
					assignment: {
						...prev.assignment,
						status: AssignmentStatus.ASSIGNED,
					},
				}));
				if (bottomSheetRef.current) {
					bottomSheetRef.current.close();
				}
			}
		} catch (error) {
			console.log('onApprove errored', error);
		}
	};

	const onReject = async () => {
		try {
			if (assignment && sheetVisible) {
				if (assignment.status !== AssignmentStatus.RESERVED) {
					return;
				}
				await assignmentService.processAssignment(AssignmentProcess.Reject);
				await setAssignmentTracking({ ...defaultAssignmentTracking });
				if (bottomSheetRef.current) {
					bottomSheetRef.current.close();
				}
			}
		} catch (error) {
			console.log('onReject errored', error);
			await setAssignmentTracking((prev: AssignmentTracking) => ({ ...prev, assignment: null }));
		}
	};

	const renderFooter = useCallback(
		(props: BottomSheetDefaultFooterProps) => (
			<BottomSheetFooter {...props} bottomInset={bottomTabBarHeight}>
				<View className="flex flex-row justify-center space-x-3 mt-1 android:pb-2">
					<Button
						mode="contained"
						onPress={onApprove}
						className="bg-green-500 rounded"
						textColor="white"
						disabled={isLoading}
					>
						{t('screens.home.assignmentSheet.approve')}
					</Button>
					<Button
						mode="contained"
						onPress={onReject}
						className="bg-red-500 rounded"
						textColor="white"
						disabled={isLoading}
					>
						{t('screens.home.assignmentSheet.reject')}
					</Button>
				</View>
			</BottomSheetFooter>
		),
		[assignment, t, isLoading]
	);

	const sheetVisible = useMemo(() => {
		if (assignment === null) return false;
		if (!assignment?.status) {
			return false;
		}
		const statuses: AssignmentStatus[] = [AssignmentStatus.RESERVED];
		return statuses.includes(assignment?.status);
	}, [assignment]);

	const renderAssignment = useCallback(() => {
		if (assignment === null) return;
		return (
			<View className="flex flex-1 w-full justify-between p-2">
				<View className="w-full flex-row">
					<View className="flex-1 flex-row items-center">
						<View className="w-14 h-14 rounded-full bg-red-500 border-red-300 border-4" />
						<View className="flex-1 px-2">
							<Text className="text-black dark:text-white text-base font-bold">
								{t('screens.home.assignmentSheet.title')}
							</Text>
							{/* <Text className="text-black dark:text-white">Ad Soyad</Text> */}
						</View>
					</View>
					{sheetVisible && (
						<CircularProgress
							ref={progressRef}
							value={0}
							radius={30}
							initialValue={TIMEOUT_SECONDS}
							maxValue={TIMEOUT_SECONDS}
							activeStrokeWidth={5}
							inActiveStrokeWidth={9}
							duration={TIMEOUT_SECONDS * 1000}
							strokeColorConfig={[
								{ color: 'red', value: 0 },
								{ color: 'orange', value: TIMEOUT_SECONDS / 2 },
								{ color: 'lightgreen', value: TIMEOUT_SECONDS * 0.75 },
								{ color: 'lightgreen', value: TIMEOUT_SECONDS },
							]}
							progressValueStyle={{ fontWeight: '100', color: 'yellow' }}
							titleFontSize={11}
							onAnimationComplete={onReject}
							progressValueColor={colorScheme === 'dark' ? 'white' : 'black'}
						/>
					)}
				</View>
				<View className="flex-1">
					<Text className="text-black dark:text-white text-base py-2">
						{t('screens.home.assignmentSheet.description')}
					</Text>
					<Divider />
					<Text className="text-black dark:text-white py-2">{assignment?.description}</Text>
				</View>
			</View>
		);
	}, [assignment, t, sheetVisible]);

	return (
		<StyledBottomSheet
			index={sheetVisible ? 0 : -1}
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			handleStyle="bg-white dark:bg-secondary-500"
			handleIndicatorStyle="bg-primary-500 dark:bg-white"
			footerComponent={renderFooter}
			backgroundStyle="bg-white dark:bg-secondary-500"
		>
			<View
				className="flex flex-1 justify-end bg-white dark:bg-secondary-500"
				style={{
					paddingBottom: bottomTabBarHeight,
				}}
			>
				{renderAssignment()}
			</View>
		</StyledBottomSheet>
	);
};

export default AssignmentSheet;
