import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ApiService from 'app/services/ApiService';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import PendingJobsWidget from './widgets/PendingJobsWidget';
import CustomerWidget from './widgets/CustomerWidget';
import RequestListWidget from './widgets/RequestListWidget';
import PendingJobListWidget from './widgets/PendingJobListWidget';


const useStyles = makeStyles(theme => ({
	layoutRoot: {}
}));

function DashboardPage(props) {
	const classes = useStyles(props);
	const history = useHistory();

	useEffect(() => {
		if (ApiService.getAccessToken() === null) {
			history.push('/login');
		}
	}, [props]);

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-100 h-100',
				toolbar: 'min-h-48 h-48',
				content: classes.content
			}}
			header={
				<div className="p-20">
					<h4>Dashboard</h4>
				</div>
			}
			content={
				<div className="p-12">
					<FuseAnimateGroup
						className="flex flex-wrap"
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
					>
						<div className="widget flex w-full sm:w-1/2 md:m-1/4 p-12">
							<PendingJobsWidget />
						</div>
						<div className="widget flex w-full sm:w-1/2 md:m-1/4 p-12">
							<CustomerWidget />
						</div>
						<div className="widget flex w-full p-12">
							<RequestListWidget />
						</div>
					</FuseAnimateGroup>
				</div>
			}
		/>
	);
}

export default DashboardPage;
