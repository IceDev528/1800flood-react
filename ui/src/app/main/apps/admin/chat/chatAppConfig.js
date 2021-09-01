import React from 'react';

const ChatAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/admin/chat',
			component: React.lazy(() => import('./chatApp'))
		}
	]
};

export default ChatAppConfig;
