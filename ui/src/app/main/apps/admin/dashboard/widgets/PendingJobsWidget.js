import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import ApiService from 'app/services/ApiService';
function PendingJobsWidget(props) {
	const [state, setState] = useState([{ status: '', count: 0 }]);

	useEffect(() => {
		ApiService.getStats().then(response => {
			setState(response.data);
		});
	}, []);

	const getCount = status => {
		const result = state.filter(s => s.status === status);
		return result.length > 0 ? result[0].count : 0;
	};

	return (
		<Paper className="w-full rounded-8 shadow-none border-1">
			<div className="text-center pt-12 pb-28">
				<Typography className="text-72 leading-none text-amber">{getCount('OPEN')}</Typography>
				<Typography className="text-16" color="textSecondary">
					Open Jobs
				</Typography>
			</div>
			<div className="flex items-center px-16 h-52 border-t-1">
				<Typography className="text-15 flex w-full text-green" color="textSecondary">
					<span className="truncate">Completed Jobs</span>:<b className="px-8">{getCount('CLOSED')}</b>
				</Typography>
				<Typography className="text-15 flex w-full text-red" color="textSecondary">
					<span className="truncate">Unpaid Jobs:</span>:<b className="px-8">{getCount('UNPAID')}</b>
				</Typography>
				<Typography className="text-15 flex w-full text-green" color="textSecondary">
					<span className="truncate">Estimates:</span>:<b className="px-8">{getCount('ESTIMATES')}</b>
				</Typography>
			</div>
		</Paper>
	);
}

export default React.memo(PendingJobsWidget);
