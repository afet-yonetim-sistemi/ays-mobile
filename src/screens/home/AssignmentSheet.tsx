import BottomSheet, { BottomSheetFooter, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CircularProgress, { ProgressRef } from 'react-native-circular-progress-indicator';
import { Divider } from 'react-native-paper';

import Button from '@/components/Button';
import StyledBottomSheet from '@/components/CustomBottomSheet';
import { useHeights } from '@/hooks/useHeights';
import { AssignmentProcess, assignmentService } from '@/services/assignment';
import {
	AssignmentStatus,
	AssignmentTracking,
	assignmentAtom,
	assignmentTrackingAtom,
	defaultAssignmentTracking,
	detailAtom,
	isLoadingAtom,
} from '@/stores/assignment';
import { locationAtom } from '@/stores/location';
import { sleep } from '@/utils';

const TIMEOUT_SECONDS = 20;

const AssignmentSheet = () => {
	const assignment = useAtomValue(assignmentAtom);
	const detail = useAtomValue(detailAtom);
	const location = useAtomValue(locationAtom);
	const isLoading = useAtomValue(isLoadingAtom);
	const setAssignmentTracking = useSetAtom(assignmentTrackingAtom);
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['30%', '70%', '85%'], []);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	const animationConfigs = useBottomSheetTimingConfigs({
		duration: 1000,
	});

	const { bottomTabBarHeight } = useHeights();
	const progressRef = useRef<ProgressRef>(null);
	const { colorScheme } = useColorScheme();

	const sheetVisible = useMemo(() => {
		if (assignment === null) return false;
		if (!assignment?.status) {
			return false;
		}
		const statuses: AssignmentStatus[] = [AssignmentStatus.RESERVED];
		return statuses.includes(assignment?.status);
	}, [assignment]);

	useEffect(() => {
		if (progressRef.current && assignment) {
			progressRef.current.reAnimate();
		}
		if (bottomSheetRef.current) {
			if (!sheetVisible) {
				bottomSheetRef.current.close();
			}
		}
	}, [sheetVisible]);

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
				if (bottomSheetRef.current) {
					bottomSheetRef.current.close();
				}
				await sleep(250);
				await setAssignmentTracking({ ...defaultAssignmentTracking });
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
						className="bg-green-500"
						textColor="white"
						disabled={isLoading}
					>
						{t('screens.home.assignmentSheet.approve')}
					</Button>
					<Button
						mode="contained"
						onPress={onReject}
						className="bg-red-500"
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
				<Divider bold className="bg-gray-300 dark:bg-secondary-400 my-2" />
				<View className="flex-1 w-full">
					<View className="flex w-full px-2 bg-[#f7f7fa] android:bg-white dark:bg-secondary-600 rounded-xl shadow shadow-gray-300 dark:shadow-slate-800 p-2 my-2 android:shadow-gray-900">
						<Text className="text-black dark:text-white text-lg py-2 font-bold">
							{t('screens.home.assignmentSheet.description')}
						</Text>
						<Text className="text-black dark:text-white text-md py-2">
							{assignment?.description}
						</Text>
					</View>
					<View className="flex w-full px-2 bg-[#f7f7fa] android:bg-white dark:bg-secondary-600 rounded-xl shadow shadow-gray-300 dark:shadow-slate-800 p-2 my-2 android:shadow-gray-900">
						<View className="flex flex-row w-full items-center space-x-4 my-2">
							<View className="w-3 h-3 bg-red-500 rounded-full" />
							<View className="flex flex-1">
								<Text className="text-black dark:text-white text-xs font-thin">
									{t('screens.home.assignmentSheet.from')}
								</Text>
								<Text className="text-black dark:text-white font-bold text-sm" numberOfLines={1}>
									{detail?.start_address}
								</Text>
							</View>
						</View>
						<Divider bold className="bg-gray-300 dark:bg-secondary-400 my-2" />
						<View className="flex flex-row w-full items-center space-x-4 my-2">
							<View className="w-3 h-3 bg-green-500 rounded-full" />
							<View className="flex flex-1">
								<Text className="text-black dark:text-white text-xs font-thin">
									{t('screens.home.assignmentSheet.to')}
								</Text>
								<Text className="text-black dark:text-white font-bold text-sm" numberOfLines={1}>
									{detail?.end_address}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	}, [assignment, t, sheetVisible, detail]);

	if (!sheetVisible) {
		return null;
	}

	return (
		<StyledBottomSheet
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			handleStyle="bg-white dark:bg-secondary-500"
			handleIndicatorStyle="bg-primary-500 dark:bg-white"
			footerComponent={renderFooter}
			backgroundStyle="bg-white dark:bg-secondary-500"
			animationConfigs={animationConfigs}
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
