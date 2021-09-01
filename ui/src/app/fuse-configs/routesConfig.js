import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import appsConfig from 'app/main/apps/admin/adminConfig';
import clientConfig from 'app/main/apps/client/clientConfig';

const routeConfigs = [...appsConfig, ...clientConfig];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/login" />
	}
];

export default routes;
