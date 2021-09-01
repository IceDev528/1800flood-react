import moment from 'moment';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import React, { useState, useEffect } from 'react';
import ApiService from 'app/services/apiService';

function BillScheduleModel(props) {
	const { schedule, open, jobId } = props;
	const initState = {
		datereceived: moment(new Date()).format("YYYY-MM-DD"),
		paymentref: '',
		progress: 0,
		amount: 0,
		jobId,
		jobprogressid: 0
	};
	const [state, setState] = useState(initState);
	const [scheduleList, setScheduleList] = useState(schedule);

	useEffect(() => {
		setScheduleList(schedule);
	}, [props]);

	const handleChange = props => event => {
		setState({ ...state, [props]: event.target.value });
	};
	const handleClick = event => {
		ApiService.addJobProgress(state, jobId).then(response => {
			setScheduleList(scheduleList.concat(response.data));
			setState(initState);
		});
	};
	const handleClose = () => {
		props.onClose(scheduleList);
	};
	const uploadPdf = e => {
		const reader = new FileReader();
		reader.onload = event => {
			const result = event.target.result;
			ApiService.uploadPdf(jobId, result);
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	const updateItem = item => {
		const newState = scheduleList.map(single => {
			if (single.jobprogressid === item.jobprogressid) {
				return item;
			}
			return single;
		});
		setScheduleList(newState);
	};
	const onDelete = schedule => {
		ApiService.delJobProgress(schedule, jobId).then(response => {
			setScheduleList(scheduleList.filter(s => s.jobprogressid !== schedule.jobprogressid));
		});
	};
	return (
		<Dialog fullWidth="true" maxWidth="md" onClose={handleClose} aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">Payment Schedules</DialogTitle>
			<DialogContent>
				<Grid container>
					<Grid item xs={12}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									type="date"
									format="dd/mm/yyyy"
									size="small"
									variant="outlined"
									onChange={handleChange('datereceived')}
									value={state.datereceived}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									size="small"
									label="Payment Ref"
									onChange={handleChange('paymentref')}
									value={state.paymentref}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									type="number"
									size="small"
									variant="outlined"
									onChange={handleChange('progress')}
									label="Progress "
									value={state.progress}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									type="number"
									size="small"
									variant="outlined"
									onChange={handleChange('amount')}
									label="Amount"
									value={state.amount}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button className="bg-green" onClick={handleClick}>
									Add
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell />
									<TableCell>Date</TableCell>
									<TableCell>Ref#</TableCell>
									<TableCell>Progress</TableCell>
									<TableCell>Amount</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(scheduleList || []).map((schedule, index) => (
									<TableRow key={index}>
										<TableCell>
											<IconButton className="text-red" onClick={() => onDelete(schedule)}>
												<Icon>delete</Icon>
											</IconButton>
										</TableCell>
										<TableCell>
											<TextField
												type="date"
												variant="outlined"
												size="small"
												label="Received Date"
												value={moment(schedule.datereceived).format("YYYY-MM-DD")}
												onChange={e =>
													updateItem({ ...schedule, datereceived: e.target.value })
												}
											/>
										</TableCell>
										<TableCell>
											<TextField
												size="small"
												style={{ width: 100 }}
												variant="outlined"
												label="Payment Ref"
												value={schedule.paymentref}
												onChange={e => updateItem({ ...schedule, paymentref: e.target.value })}
											/>
										</TableCell>
										<TableCell>{schedule.progress}%</TableCell>
										<TableCell>{ApiService.formatCurrency(schedule.amount)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="secondary" onClick={handleClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default BillScheduleModel;
