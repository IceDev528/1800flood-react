import React from 'react';
import { authRoles } from 'app/auth';
import Register from './Register';

const RegisterConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	routes: [
		{
			path: '/register',
			component: Register
		}
	]
};

export default RegisterConfig;
