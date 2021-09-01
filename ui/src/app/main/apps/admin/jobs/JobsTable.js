import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import ApiService from 'app/services/ApiService';
import JobsTableHead from './JobsTableHead';
import FuseUtils from '@fuse/utils';

function JobsTable(props) {

	const { search, filter } = props;
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		ApiService.getJobs().then(response => {
			const result = FuseUtils.filterArrayByString(response.data, search);
			if (filter !== 'ALL') {
				setData(result.filter(s => s.jobstatus === filter));
			} else {
				setData(result);
			}
		});
	}, [props]);

	
	const chartStyle = {
		width: '130px'
	};

	function handleRequestSort(event, property) {
		console.log(event);
		console.log(property);
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/apps/admin/job/${item.jobid}`);
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table className="min-w-xl" aria-labelledby="tableTitle">
					<JobsTableHead
						numSelected={selected.length}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.id) {
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.direction]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(n => {
								const isSelected = selected.indexOf(n.jobid) !== -1;
								return (
									<TableRow
										className="cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.jobid}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell className="w-64 text-center" padding="none">
											<Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.jobid)}
											/>
										</TableCell>

										<TableCell valign="top" component="th" className="w-80" scope="row">
											{n.jobid + 300000}
										</TableCell>

										<TableCell valign="top" className="truncate w-40" component="th" scope="row">
											{n.category} - {n.class}
										</TableCell>

										<TableCell component="th" scope="row" className="w-100" align="left">
											<Typography variant="body1">{n.customername}</Typography>
											<Typography variant="body1">{n.billingaddressline1}</Typography>
											<Typography variant="body1">{n.billingaddressline2}</Typography>
											<Typography variant="body1">{n.billingsuburb}</Typography>
											<Typography variant="body1">
												{n.billlingstate} - {n.billingpostcode}
											</Typography>
										</TableCell>

										<TableCell component="th" scope="row" align="left" className="w-100">
											<GaugeChart
												id={'row' + n.jobid}
												percent={parseFloat(n.progress/100)}
												nrOfLevels={10}
												arcsWidth={0.5}
												cornerRadius={5}
												colors={['#FF5F6D', '#FFC371', '#009923']}
												style={chartStyle}
												textColor="black"
												needleColor="gray"
											/>
										</TableCell>

										<TableCell
											className="w-50"
											component="th"
											scope="row"
											align="center"
											valign="top"
										>
											{n.jobstatus}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				<TablePagination
					className="overflow-hidden"
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</FuseScrollbars>
		</div>
	);
}

export default withRouter(JobsTable);
