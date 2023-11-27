import BottomSheet, { BottomSheetFooter, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { PermissionStatus } from 'expo-location';
import { useAtomValue, useSetAtom } from 'jotai';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CircularProgress, { ProgressRef } from 'react-native-circular-progress-indicator';
import { Divider, IconButton } from 'react-native-paper';

import Button from '@/components/Button';
import StyledBottomSheet from '@/components/CustomBottomSheet';
import { useAuth } from '@/hooks/useAuth';
import { useHeights } from '@/hooks/useHeights';
import { AssignmentProcess, assignmentService } from '@/services/assignment';
import {
	AssignmentStatus,
	AssignmentTracking,
	assignmentAtom,
	assignmentDetailAtom,
	assignmentTrackingAtom,
	defaultAssignmentTracking,
	detailAtom,
	isDetailOpenAtom,
	isLoadingAtom,
	isWaitingForConfirmationAtom,
} from '@/stores/assignment';
import { locationAtom } from '@/stores/location';
import { permissionsAtom, userAgreementAtom } from '@/stores/permissions';
import { modalAtom } from '@/stores/ui';
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

	const permissions = useAtomValue(permissionsAtom);
	const userAgreement = useAtomValue(userAgreementAtom);
	const isWaitingForConfirmation = useAtomValue(isWaitingForConfirmationAtom);
	const setModal = useSetAtom(modalAtom);
	const isDetailOpen = useAtomValue(isDetailOpenAtom);
	const { updateProfile } = useAuth();
	const assignmentDetail = useAtomValue(assignmentDetailAtom);
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
		if (isWaitingForConfirmation) {
			return true;
		}
		const statuses: AssignmentStatus[] = [AssignmentStatus.RESERVED];
		return statuses.includes(assignment?.status);
	}, [assignment, isWaitingForConfirmation]);

	const isAssignmentCancelable = useMemo(() => {
		if (assignment === null) return false;
		const statuses: AssignmentStatus[] = [AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS];

		return statuses.includes(assignment?.status) && isWaitingForConfirmation;
	}, [assignment, isWaitingForConfirmation]);

	const isMapAccessible = useMemo(
		() =>
			permissions.location === PermissionStatus.GRANTED &&
			permissions.backgroundLocation === PermissionStatus.GRANTED &&
			userAgreement.accepted &&
			location,
		[permissions, userAgreement, location]
	);

	useEffect(() => {
		if (progressRef.current && assignment) {
			progressRef.current.reAnimate();
		}
		if (!sheetVisible) {
			closeBottomSheet();
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
					isWaitingForConfirmation: false,
					assignment: {
						...prev.assignment,
						status: AssignmentStatus.ASSIGNED,
					},
				}));
				await assignmentService.setAssignment();
				closeBottomSheet();
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
				closeBottomSheet();
				await sleep(250);
				await setAssignmentTracking({ ...defaultAssignmentTracking });
			}
		} catch (error) {
			console.log('onReject errored', error);
			await setAssignmentTracking((prev: AssignmentTracking) => ({ ...prev, assignment: null }));
		}
	};

	const onCancel = async (reason: string) => {
		try {
			if (assignment && sheetVisible) {
				if (!isAssignmentCancelable) {
					return;
				}
				await assignmentService.cancelAssignment({
					reason,
				});
				await updateProfile();
				closeBottomSheet();
				await sleep(250);
				await setAssignmentTracking({ ...defaultAssignmentTracking });
			}
		} catch (error) {
			console.log('onCancel errored', error);
			await setAssignmentTracking((prev: AssignmentTracking) => ({ ...prev, assignment: null }));
		}
	};

	const closeBottomSheet = async () => {
		if (bottomSheetRef.current) {
			bottomSheetRef.current.forceClose();
			await setAssignmentTracking((prev: AssignmentTracking) => ({
				...prev,
				isDetailOpen: false,
			}));
		}
	};

	const onCancelModal = async () => {
		setModal((prev) => ({
			...prev,
			visible: true,
			type: 'prompt',
			title: t('screens.home.assignmentSheet.cancelAssignment'),
			onConfirm(confirmInput) {
				confirmInput && onCancel(confirmInput);
			},
			confirmInputProps: {
				label: t('screens.home.fields.confirmText'),
				rules: {
					required: t('errors.required', {
						field: t('screens.home.fields.confirmText'),
					}),
					minLength: {
						value: 40,
						message: t('errors.minLength', {
							field: t('screens.home.fields.confirmText'),
							length: 40,
						}),
					},
					maxLength: {
						value: 512,
						message: t('errors.maxLength', {
							field: t('screens.home.assignmentSheet.cancelReason'),
							length: 512,
						}),
					},
				},
			},
			multiline: true,
		}));
	};

	const onContinue = async () => {
		closeBottomSheet();
		await setAssignmentTracking((prev: AssignmentTracking) => ({
			...prev,
			isWaitingForConfirmation: false,
		}));
	};

	const renderFooter = useCallback(
		(props: BottomSheetDefaultFooterProps) => (
			<BottomSheetFooter {...props} bottomInset={bottomTabBarHeight}>
				{isWaitingForConfirmation && (
					<View className="flex flex-row justify-center space-x-3 mt-1 android:pb-2">
						<Button
							mode="contained"
							onPress={isAssignmentCancelable ? onContinue : onApprove}
							className="bg-green-500"
							textColor="white"
							disabled={isLoading}
						>
							{t(`screens.home.assignmentSheet.${isAssignmentCancelable ? 'continue' : 'approve'}`)}
						</Button>
						<Button
							mode="contained"
							onPress={isAssignmentCancelable ? onCancelModal : onReject}
							className="bg-red-500"
							textColor="white"
							disabled={isLoading}
						>
							{t(`screens.home.assignmentSheet.${isAssignmentCancelable ? 'cancel' : 'reject'}`)}
						</Button>
					</View>
				)}
			</BottomSheetFooter>
		),
		[
			assignment,
			t,
			isLoading,
			isAssignmentCancelable,
			bottomTabBarHeight,
			assignmentDetail,
			isDetailOpen,
			isWaitingForConfirmation,
		]
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
					{sheetVisible && assignment.status === AssignmentStatus.RESERVED ? (
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
					) : (
						<IconButton icon="close" onPress={closeBottomSheet} />
					)}
				</View>
				<Divider bold className="bg-gray-300 dark:bg-secondary-400 my-2" />
				<View className="flex-1 w-full">
					{assignmentDetail && (
						<View className="flex w-full px-2 bg-[#f7f7fa] android:bg-white dark:bg-secondary-600 rounded-xl shadow shadow-gray-300 dark:shadow-slate-800 p-2 my-2 android:shadow-gray-900">
							<Text className="text-black dark:text-white text-lg py-2 font-bold">
								{assignmentDetail.firstName + ' ' + assignmentDetail.lastName}
							</Text>
							<Text className="text-black dark:text-white text-md py-2">
								{assignmentDetail?.phoneNumber
									? assignmentDetail?.phoneNumber?.countryCode +
									  assignmentDetail?.phoneNumber?.lineNumber
									: ''}
							</Text>
						</View>
					)}
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
	}, [assignment, t, sheetVisible, detail, closeBottomSheet]);

	useEffect(() => {
		if (isDetailOpen) {
			if (bottomSheetRef.current) {
				bottomSheetRef.current.snapToIndex(0);
			}
		}
	}, [isDetailOpen]);

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
			index={(sheetVisible && isMapAccessible) || isDetailOpen ? 0 : -1}
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
