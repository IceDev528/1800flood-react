import React from 'react';
import SettingsPage from './SettingsPage';
const SettingsConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/client/settings',
			component: SettingsPage
		}
	]
};

export default SettingsConfig;
