import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CircularProgress, { ProgressRef } from 'react-native-circular-progress-indicator';
import { Button } from 'react-native-paper';

import StyledBottomSheet from '@/components/CustomBottomSheet';
import { useHeights } from '@/hooks/useHeights';

const TIMEOUT_SECONDS = 5;

const AssignmentSheet = () => {
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['25%', '70%'], []);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	const { bottomTabBarHeight } = useHeights();
	const progressRef = useRef<ProgressRef>(null);
	const { colorScheme } = useColorScheme();

	useEffect(() => {
		if (progressRef.current) {
			progressRef.current.reAnimate();
		}
	}, []);

	const onApprove = () => {
		console.log('onApprove');
	};

	const onReject = () => {
		if (bottomSheetRef.current) bottomSheetRef.current.close();
	};

	const renderFooter = useCallback(
		(props: BottomSheetDefaultFooterProps) => (
			<BottomSheetFooter {...props} bottomInset={24}>
				<View className="flex flex-row justify-center space-x-3 mt-1">
					<Button
						mode="contained"
						onPress={onApprove}
						className="bg-green-500 rounded"
						textColor="white"
					>
						{t('screens.home.assignmentSheet.approve')}
					</Button>
					<Button
						mode="contained"
						onPress={onReject}
						className="bg-red-500 rounded"
						textColor="white"
					>
						{t('screens.home.assignmentSheet.reject')}
					</Button>
				</View>
			</BottomSheetFooter>
		),
		[]
	);

	return (
		<View
			className="bottom-0 absolute h-full w-full"
			style={{
				zIndex: 9999,
			}}
		>
			<StyledBottomSheet
				ref={bottomSheetRef}
				index={0}
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
					<View className="flex flex-1 w-full justify-between p-2">
						<View className="w-full flex-row">
							<View className="flex-1 flex-row items-center">
								<View className="w-16 h-16 rounded-full bg-primary-500" />
								<View className="flex-1 px-2">
									<Text className="text-black dark:text-white text-base">Ad Soyad</Text>
									<Text className="text-black dark:text-white">Ad Soyad</Text>
								</View>
							</View>
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
						</View>
					</View>
				</View>
			</StyledBottomSheet>
		</View>
	);
};

export default AssignmentSheet;
