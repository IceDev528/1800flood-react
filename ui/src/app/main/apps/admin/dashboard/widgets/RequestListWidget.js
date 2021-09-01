import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import moment from 'moment';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import ApiService from 'app/services/ApiService';
import CustomerDropdown from 'app/main/common/CustomerDropdown';

function RequestListWidget(props) {
	const [data, setData] = useState({
		title: 'User Account requests',
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
					id: 'customerid',
					title: 'Customer'
				}
			],
			rows: []
		}
	});

	const dispatch = useDispatch();

	const refreshData = () => {
		ApiService.getUsers().then(response => {
			setData(state => ({ title: state.title, table: { columns: state.table.columns, rows: response.data } }));
		});
	};

	useEffect(() => {
		refreshData();
	}, []);

	const onclick = userid => event => {
		ApiService.activateUser().then(response => {
			refreshData();
		});
	};

	const handleInputChange = (prop, index) => event => {
		console.log(prop, index, event);
		let item = data.table.rows[index];
		if (prop === 'customerid') {
			item.customerid = event;
		} else {
			item[prop]["data"][0] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		}
		let tempRows = [ ...data.table.rows];
		tempRows[index] = item;
		setData(state => ({ title: state.title, table: { columns: state.table.columns, rows: tempRows }}));

		ApiService.activateUser(item.userid, { customerid: item.customerid, active: item.isactive.data[0] }).then(data => {
			dispatch(
				MessageActions.showMessage({
					message     : 'User status is udpated',//text or html
					autoHideDuration: 6000,//ms
					anchorOrigin: {
						vertical  : 'top',//top bottom
						horizontal: 'center'//left center right
					},
					variant: 'success'
				}));
		})
	};

	return (
		<Paper className="w-full rounded-8 shadow-none border-1">
			<div className="flex items-center justify-between px-16 h-64 border-b-1">
				<Typography className="text-16">{data.title}</Typography>
			</div>
			<div className="table-responsive">
				<Table className="w-full min-w-full">
					<TableHead>
						<TableRow>
							{data.table.columns.map(column => (
								<TableCell key={column.id} className="whitespace-no-wrap">
									{column.title}
								</TableCell>
							))}
							<TableCell>
								<Typography>Action</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.table.rows.map((row, index) => (
							<TableRow key={row.userid}>
								<TableCell component="th" scope="row">
									<Typography>{row.firstname}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.lastname}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.email}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<Typography>{row.mobile}</Typography>
								</TableCell>
								<TableCell component="th" scope="row">
									<CustomerDropdown id={row.customerid} onChange={handleInputChange('customerid', index)} />
								</TableCell>
								<TableCell>
									<Switch checked={row.isactive.data[0]} onChange={handleInputChange('isactive', index)} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</Paper>
	);
}

export default React.memo(RequestListWidget);
