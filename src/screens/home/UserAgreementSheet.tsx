import BottomSheet, { BottomSheetFooter, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { useAtom, useSetAtom } from 'jotai';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

import Button from '@/components/Button';
import StyledBottomSheet from '@/components/CustomBottomSheet';
import StyledListAccordion from '@/components/StyledListAccordion';
import { useHeights } from '@/hooks/useHeights';
import { userAgreementAtom, userAgreementSheetAtom } from '@/stores/permissions';
import { sleep } from '@/utils';

const privacyPolicy =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nunc sodales, porta libero vehicula, egestas purus. Nunc eu cursus nulla, id auctor lectus. Aenean sit amet massa sed leo gravida ultricies sit amet in est. Donec placerat lectus eu mi ultricies porttitor. Aenean ante tortor, fringilla ut ex eget, varius egestas justo. Vestibulum molestie nibh sodales nisl convallis venenatis. Fusce vehicula ligula ac felis semper auctor. Quisque aliquet, lorem id ornare fringilla, nunc orci ultricies lectus, a aliquet mauris est id augue. Nullam libero felis, imperdiet et nisl id, commodo rhoncus ipsum. Aenean risus lorem, maximus ac metus sit amet, imperdiet bibendum ligula. Vestibulum a risus quam. Etiam condimentum metus nec mi sagittis egestas. Mauris vitae fringilla nunc. Mauris tincidunt arcu tellus, eget condimentum arcu gravida quis. Duis turpis mauris, tristique quis libero vitae, venenatis tempus ex. Aenean fringilla sit amet ante vel ullamcorper. Integer eget enim eget mi varius luctus et sed lorem. Phasellus hendrerit id urna eu convallis. Aliquam auctor accumsan elit ac ullamcorper. Sed quis leo vitae dui viverra dignissim vestibulum sed tellus. Phasellus rutrum est at magna sollicitudin, nec viverra eros pulvinar. Mauris enim felis, porta a nibh vitae, laoreet porttitor metus. Vivamus gravida rhoncus velit in hendrerit. Pellentesque congue, odio sed dictum sodales, lorem ex interdum urna, eget tempus magna est non diam. Integer scelerisque lobortis dui id molestie. Nulla et diam eros. Duis eu augue justo. Suspendisse potenti. Mauris vulputate vulputate ex nec mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nunc sodales, porta libero vehicula, egestas purus. Nunc eu cursus nulla, id auctor lectus. Aenean sit amet massa sed leo gravida ultricies sit amet in est. Donec placerat lectus eu mi ultricies porttitor. Aenean ante tortor, fringilla ut ex eget, varius egestas justo. Vestibulum molestie nibh sodales nisl convallis venenatis. Fusce vehicula ligula ac felis semper auctor. Quisque aliquet, lorem id ornare fringilla, nunc orci ultricies lectus, a aliquet mauris est id augue. Nullam libero felis, imperdiet et nisl id, commodo rhoncus ipsum. Aenean risus lorem, maximus ac metus sit amet, imperdiet bibendum ligula. Vestibulum a risus quam. Etiam condimentum metus nec mi sagittis egestas. Mauris vitae fringilla nunc. Mauris tincidunt arcu tellus, eget condimentum arcu gravida quis. Duis turpis mauris, tristique quis libero vitae, venenatis tempus ex. Aenean fringilla sit amet ante vel ullamcorper. Integer eget enim eget mi varius luctus et sed lorem. Phasellus hendrerit id urna eu convallis. Aliquam auctor accumsan elit ac ullamcorper. Sed quis leo vitae dui viverra dignissim vestibulum sed tellus. Phasellus rutrum est at magna sollicitudin, nec viverra eros pulvinar. Mauris enim felis, porta a nibh vitae, laoreet porttitor metus. Vivamus gravida rhoncus velit in hendrerit. Pellentesque congue, odio sed dictum sodales, lorem ex interdum urna, eget tempus magna est non diam. Integer scelerisque lobortis dui id molestie. Nulla et diam eros. Duis eu augue justo. Suspendisse potenti. Mauris vulputate vulputate ex nec mattis.';

type ListItemType = {
	title: string;
	value: string;
};

const UserAgreementSheet = () => {
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const setUserAgreement = useSetAtom(userAgreementAtom);
	const [userAgreementSheet, setUserAgreementSheet] = useAtom(userAgreementSheetAtom);
	const snapPoints = ['95%'];
	const [openedIndex, setOpenedIndex] = useState<number>(2);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	const animationConfigs = useBottomSheetTimingConfigs({
		duration: 1000,
	});

	const { bottomTabBarHeight } = useHeights();

	const onAction = async (isApproved: boolean) => {
		if (bottomSheetRef.current) {
			bottomSheetRef.current.close();
		}
		await sleep(350);
		setUserAgreementSheet((prev) => ({ ...prev, isOpen: false, isApproved }));
	};

	const onClose = async () => {
		await onAction(false);
	};

	const onApprove = async () => {
		await onAction(true);
	};

	useEffect(() => {
		if (bottomSheetRef.current) {
			if (userAgreementSheet.isOpen) {
				bottomSheetRef.current.close();
			}
		}
	}, [userAgreementSheet.isOpen, bottomSheetRef]);

	const listItems: ListItemType[] = useMemo(() => {
		return [
			{
				title: t('screens.home.userAgreementSheet.listItems.termsAndConditions'),
				value: privacyPolicy,
			},
			{
				title: t('screens.home.userAgreementSheet.listItems.privacyPolicy'),
				value: privacyPolicy,
			},
		];
	}, [t]);

	const renderFooter = useCallback(
		(props: BottomSheetDefaultFooterProps) => (
			<BottomSheetFooter {...props} bottomInset={bottomTabBarHeight}>
				<View className="flex px-4 justify-center space-y-1 pt-1 android:pb-2">
					<Button mode="contained" textColor="white" onPress={onApprove}>
						{t('screens.home.userAgreementSheet.approve')}
					</Button>
					<Button mode="text" textColor="white" onPress={onClose}>
						{t('screens.home.userAgreementSheet.reject')}
					</Button>
				</View>
			</BottomSheetFooter>
		),
		[bottomTabBarHeight]
	);

	const onIndexChange = (index: number): void => {
		setOpenedIndex(index === openedIndex ? -1 : index);
	};

	if (!userAgreementSheet.isOpen) {
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
			<View className="flex flex-1 bg-white dark:bg-secondary-500">
				<Text className="text-center text-xl font-bold py-7">
					{t('screens.home.userAgreementSheet.title')}
				</Text>
				<DocumentList items={listItems} selectedIndex={openedIndex} onChange={onIndexChange} />
			</View>
		</StyledBottomSheet>
	);
};

type DocumentListProps = {
	items: ListItemType[];
	selectedIndex: number;
	onChange: (value: number) => void;
};

const DocumentList = memo(({ items, selectedIndex, onChange }: DocumentListProps) => {
	const renderItems = () => {
		return items.map((item, index) => (
			<StyledListAccordion
				key={index}
				title={item.title}
				expanded={selectedIndex === index}
				onPress={() => onChange(index)}
				className="mb-2 bg-gray-100 dark:bg-card"
				titleStyle="dark:text-white"
				theme={{
					colors: {
						background: 'transparent',
					},
				}}
			>
				<ScrollView className="h-full bg-gray-100 dark:bg-secondary-700">
					<Text className="p-3">{item.value}</Text>
				</ScrollView>
			</StyledListAccordion>
		));
	};
	const height = Dimensions.get('screen').height;

	return (
		<View
			style={{
				height: height * 0.5,
			}}
		>
			{renderItems()}
		</View>
	);
});

export default UserAgreementSheet;
