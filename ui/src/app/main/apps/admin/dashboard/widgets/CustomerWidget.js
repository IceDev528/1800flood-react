import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';

function PendingJobsWidget(props) {
	
	return (
		<Paper className="w-full rounded-8 shadow-none border-1">
			<div className="text-center pt-12 pb-28">
				<Typography className="text-72 leading-none text-amber">4</Typography>
				<Typography className="text-16" color="textSecondary">
					Pending Customer Requests
				</Typography>
			</div>
			<div className="flex items-center px-16 h-52 border-t-1">
				<Typography className="text-15 flex w-full text-green" color="textSecondary">
					<span className="truncate">Active Customers</span>:
					<b className="px-8">10</b>
        </Typography>
			</div>
		</Paper>
	);
}

export default React.memo(PendingJobsWidget);
