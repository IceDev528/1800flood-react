import i18next from 'i18next';
import { authRoles } from 'app/auth';

const navigationConfig = [
	{
		
		id: 'admin-component',
		title: 'Admin',
		translate: 'Admin',
		type: 'collapse',
		icon: 'dashboards',
		auth: authRoles.admin,
		children: [
			{
				id: 'admin-dashbaord',
				title: 'Dashboard',
				type: 'item',
				icon: 'dashboard',
				url: '/apps/admin/dashboard',
				exact: true,
			},
			{
				id: 'admin-jobs',
				title: 'Jobs and Quotes',
				type: 'item',
				icon: 'list',
				url: '/apps/admin/jobs',
				exact: true,
			},
			{
				id: 'admin-setting',
				title: 'Settings',
				type: 'item',
				icon: 'settings',
				url: '/apps/admin/settings',
				exact: true,
			},
		]
	},
	{
		id: 'customer-component',
		title: 'Customer',
		translate: 'Customer',
		type: 'collapse',
		icon: 'users',
		auth: authRoles.user,
		children: [
			{
				id: 'customer-jobs',
				title: 'Jobs',
				type: 'item',
				icon: 'list',
				url: '/apps/client/jobs',
				exact: true,
			},
			{
				id: 'customer-setting',
				title: 'Settings',
				type: 'item',
				icon: 'settings',
				url: '/apps/client/settings',
				exact: true,
			},
		]
	}
];

export default navigationConfig;
