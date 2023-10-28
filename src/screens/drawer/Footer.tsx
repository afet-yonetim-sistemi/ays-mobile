import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

function Footer() {
	const { logout } = useAuth();
	const { t } = useTranslation();
	return (
		<View className="mt-2">
			<Button textColor="red" onPress={logout}>
				{t('buttons.logout')}
			</Button>
		</View>
	);
}

export default Footer;
