import React from 'react';

const JobsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/admin/jobs/new',
            component: React.lazy(() => import('./NewJob'))
        },
        {
            path: '/apps/admin/job/:jobId',
            component: React.lazy(() => import('./Job'))
        },
        {
            path: '/apps/admin/jobs',
            component: React.lazy(() => import('./Jobs'))
        },

    ]
};

export default JobsAppConfig;