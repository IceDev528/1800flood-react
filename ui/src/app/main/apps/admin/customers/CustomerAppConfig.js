import React from 'react';

const CustomerConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/admin/customer/:cusotmerId',
			component: React.lazy(() => import('./Customer'))
		},
		{
			path: '/apps/admin/customers',
			component: React.lazy(() => import('./CustomerApp'))
		}
	]
};

export default CustomerConfig;
