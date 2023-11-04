import { AntDesign } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import colors from 'tailwindcss/colors';

import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import useAppearance from '@/hooks/useAppearance';
import { userAgreementSheetAtom } from '@/stores/permissions';

const privacyPolicy =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nunc sodales, porta libero vehicula, egestas purus. Nunc eu cursus nulla, id auctor lectus. Aenean sit amet massa sed leo gravida ultricies sit amet in est. Donec placerat lectus eu mi ultricies porttitor. Aenean ante tortor, fringilla ut ex eget, varius egestas justo. Vestibulum molestie nibh sodales nisl convallis venenatis. Fusce vehicula ligula ac felis semper auctor. Quisque aliquet, lorem id ornare fringilla, nunc orci ultricies lectus, a aliquet mauris est id augue. Nullam libero felis, imperdiet et nisl id, commodo rhoncus ipsum. Aenean risus lorem, maximus ac metus sit amet, imperdiet bibendum ligula. Vestibulum a risus quam. Etiam condimentum metus nec mi sagittis egestas. Mauris vitae fringilla nunc. Mauris tincidunt arcu tellus, eget condimentum arcu gravida quis. Duis turpis mauris, tristique quis libero vitae, venenatis tempus ex. Aenean fringilla sit amet ante vel ullamcorper. Integer eget enim eget mi varius luctus et sed lorem. Phasellus hendrerit id urna eu convallis. Aliquam auctor accumsan elit ac ullamcorper. Sed quis leo vitae dui viverra dignissim vestibulum sed tellus. Phasellus rutrum est at magna sollicitudin, nec viverra eros pulvinar. Mauris enim felis, porta a nibh vitae, laoreet porttitor metus. Vivamus gravida rhoncus velit in hendrerit. Pellentesque congue, odio sed dictum sodales, lorem ex interdum urna, eget tempus magna est non diam. Integer scelerisque lobortis dui id molestie. Nulla et diam eros. Duis eu augue justo. Suspendisse potenti. Mauris vulputate vulputate ex nec mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nunc sodales, porta libero vehicula, egestas purus. Nunc eu cursus nulla, id auctor lectus. Aenean sit amet massa sed leo gravida ultricies sit amet in est. Donec placerat lectus eu mi ultricies porttitor. Aenean ante tortor, fringilla ut ex eget, varius egestas justo. Vestibulum molestie nibh sodales nisl convallis venenatis. Fusce vehicula ligula ac felis semper auctor. Quisque aliquet, lorem id ornare fringilla, nunc orci ultricies lectus, a aliquet mauris est id augue. Nullam libero felis, imperdiet et nisl id, commodo rhoncus ipsum. Aenean risus lorem, maximus ac metus sit amet, imperdiet bibendum ligula. Vestibulum a risus quam. Etiam condimentum metus nec mi sagittis egestas. Mauris vitae fringilla nunc. Mauris tincidunt arcu tellus, eget condimentum arcu gravida quis. Duis turpis mauris, tristique quis libero vitae, venenatis tempus ex. Aenean fringilla sit amet ante vel ullamcorper. Integer eget enim eget mi varius luctus et sed lorem. Phasellus hendrerit id urna eu convallis. Aliquam auctor accumsan elit ac ullamcorper. Sed quis leo vitae dui viverra dignissim vestibulum sed tellus. Phasellus rutrum est at magna sollicitudin, nec viverra eros pulvinar. Mauris enim felis, porta a nibh vitae, laoreet porttitor metus. Vivamus gravida rhoncus velit in hendrerit. Pellentesque congue, odio sed dictum sodales, lorem ex interdum urna, eget tempus magna est non diam. Integer scelerisque lobortis dui id molestie. Nulla et diam eros. Duis eu augue justo. Suspendisse potenti. Mauris vulputate vulputate ex nec mattis.';

type ListItemType = {
	title: string;
	value: string;
};

const UserAgreement = () => {
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [userAgreementSheet, setUserAgreementSheet] = useAtom(userAgreementSheetAtom);
	const [openedIndex, setOpenedIndex] = useState<number>(-1);

	const onAction = async (isApproved: boolean) => {
		router.back();
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

	const onIndexChange = (index: number): void => {
		setOpenedIndex(index === openedIndex ? -1 : index);
	};

	const iconColor = useAppearance(Colors.primary[500], colors.white);

	return (
		<View className="flex flex-1 bg-white dark:bg-secondary-500 py-2 items-center">
			<View className="flex-grow w-full">
				<DocumentList
					items={listItems}
					selectedIndex={openedIndex}
					onChange={onIndexChange}
					iconColor={iconColor}
				/>
			</View>
			<View className="flex flex-row px-4 w-4/5 pt-1 android:pb-3 ios:pb-5 items-center justify-between">
				<Button
					mode="contained"
					textColor={useAppearance(colors.red[500], colors.white)}
					onPress={onClose}
					className="bg-gray-100 dark:bg-card"
				>
					{t('screens.home.userAgreementSheet.reject').toLocaleUpperCase()}
				</Button>
				<Button mode="contained" textColor="white" onPress={onApprove}>
					{t('screens.home.userAgreementSheet.approve').toLocaleUpperCase()}
				</Button>
			</View>
		</View>
	);
};

type DocumentListProps = {
	items: ListItemType[];
	selectedIndex: number;
	onChange: (value: number) => void;
	iconColor: string;
};

const DocumentList = memo(({ items, selectedIndex, onChange, iconColor }: DocumentListProps) => {
	if (!items.length) {
		return null;
	}

	return items.map((item, index) => (
		<View className={selectedIndex === index ? 'flex-1' : ''} key={index}>
			<TouchableOpacity
				className="flex flex-row mb-2 bg-gray-100 dark:bg-card py-0 items-center p-3"
				onPress={() => onChange(index)}
			>
				<Text className="flex-1 my-1">{item.title}</Text>
				<AntDesign name={selectedIndex !== index ? 'down' : 'up'} size={16} color={iconColor} />
			</TouchableOpacity>
			{selectedIndex === index && (
				<View className="flex-1 mb-2">
					<ScrollView className="h-full bg-gray-100 dark:bg-secondary-700">
						<Text className="p-3">{item.value}</Text>
					</ScrollView>
				</View>
			)}
		</View>
	));
});

export default UserAgreement;
