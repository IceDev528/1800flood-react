import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef } from 'react';
import withReducer from  'app/store/withReducer';
import { useTranslation } from 'react-i18next';
import CustomerHeader from './CustomerHeader';
import CustomerRequests from './CustomerRequests';
import reducer from './store/reducers';

const useStyles = makeStyles(theme => ({
	layoutRoot: {}
}));

function CustomerApp(props) {
	const classes = useStyles(props);
	const { t } = useTranslation('examplePage');
	const pageLayout = useRef(null);
	return (
		<FusePageSimple
			classes={{
				contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
				content: 'flex flex-col h-full',
				leftSidebar: 'w-256 border-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<CustomerHeader />}
			content={<CustomerRequests />}
			sidebarInner
			ref={pageLayout}
			innerScroll
		/>
	);
}

export default withReducer('customerApp', reducer)(CustomerApp);
