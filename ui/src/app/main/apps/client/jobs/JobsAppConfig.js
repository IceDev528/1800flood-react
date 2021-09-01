import React from 'react';

const JobsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/client/job/:jobId',
            component: React.lazy(() => import('./Job'))
        },
        {
            path: '/apps/client/jobs',
            component: React.lazy(() => import('./Jobs'))
        },

    ]
};

export default JobsAppConfig;
