import React from 'react';

const SettingsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/admin/settings',
            component: React.lazy(() => import('./Settings'))
        }
    ]
};

export default SettingsConfig;