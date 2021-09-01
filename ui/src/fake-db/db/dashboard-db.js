import mock from '../mock';

const dashboardDB = {
	widgets: {
		widget: {
			title: 'Customer Pending requests',
			table: {
				columns: [
					{
						id: 'name',
						title: 'User Name'
					},
					{
						id: 'company',
						title: 'Company'
					},
					{
						id: 'email',
						title: 'Email'
					},
					{
						id: 'mobile',
						title: 'Mobile'
					},
					{
						id: 'state',
						title: 'State'
					},
					{
						id: 'date',
						title: 'Requested'
					}
				],
				rows: [
					{
						id: 1,
						name: 'Adam Smith',
						customer: 'Mirvac',
						email: 'adam.smith@mirvac.com.au',
						mobile: '0433999999',
						suburb: 'NSW',
						date: new Date()
					},
					{
						name: 'Nath Hugh',
						customer: 'Stockland',
						email: 'nath@stockland.com.au',
						mobile: '0433 888 888',
						suburb: 'VIC',
						date: new Date()
					},
					{
						name: 'Amy Adams',
						customer: 'LandLease',
						email: 'amyadams@landlease.com.au',
						mobile: '0433 999 888',
						suburb: 'NSW',
						date: new Date()
					},
					{
						name: 'Jenifer Lawrence',
						customer: 'Raywhite',
						email: 'jlawrence@raywhite.com.au',
						mobile: '0433 999 666',
						suburb: 'NT',
						date: new Date()
					}
				]
			}
		}
	}
};

mock.onGet('/api/dashboard-app/dashboard').reply(config => {
	return [200, dashboardDB.widgets];
});
