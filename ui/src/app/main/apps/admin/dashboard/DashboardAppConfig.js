import React from 'react';
import DashboardPage from  './Dashboard';
const DashboardAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/admin/dashboard',
            component: DashboardPage
        },

    ]
};

export default DashboardAppConfig;