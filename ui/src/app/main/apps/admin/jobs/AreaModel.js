import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import React, { useState, useEffect } from 'react';
import ApiService from 'app/services/apiService';

function AreaModel(props) {
	const { areas, open, jobId } = props;
	console.log(moment().format('DD/MM/YYYY'));
	const initState = { name: '', goal: 0.0, decommissiondate: moment(new Date()).format('YYYY-MM-DD') };
	const [area, setArea] = useState(initState);
	const [areaList, setAreaList] = useState(areas);
	useEffect(() => {
		setAreaList(areas);
	}, [props]);

	const handleChange = props => event => {
		setArea({ ...area, [props]: event.target.value });
	};
	const handleClick = event => {
		ApiService.addJobArea(area, jobId).then(response => {
			setAreaList(areaList.concat(response.data));
			setArea(initState);
		});
	};
	const handleClose = () => {
		props.onClose(areaList);
	};
	const onDelete = item => {
		ApiService.delJobArea(item, jobId).then(response => {
			setAreaList(areaList.filter(a => a.areaid !== item.areaid));
			props.onDelete(areaList.filter(a => a.areaid !== item.areaid));
		});
	};
	return (
		<Dialog onClose={handleClose} aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">Areas</DialogTitle>
			<DialogContent>
				<Grid container>
					<Grid item xs={12}>
						<Grid container spacing={1}>
							<Grid item xs={3}>
								<TextField
									size="small"
									type="text"
									value={area.name}
									label="Name"
									onChange={handleChange('name')}
									variant="outlined"
									autoFocus
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									size="small"
									type="number"
									value={area.goal}
									label="Goal"
									onChange={handleChange('goal')}
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									style={{ width: '180px' }}
									size="small"
									type="date"
									value={area.decommissiondate}
									label="Decommission Date"
									onChange={handleChange('decommissiondate')}
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={2}>
								<Button variant="primary" className="bg-green" onClick={handleClick}>
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
									<TableCell>Name</TableCell>
									<TableCell>Goal</TableCell>
									<TableCell>Decommission Date</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(areaList || []).map((item, index) => (
									<TableRow key={item.areaid}>
										<TableCell>
											<IconButton className="text-red" size="small" onClick={()=>{ onDelete(item) }}>
												<Icon>delete</Icon>
											</IconButton>
										</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.goal}%</TableCell>
										<TableCell>{moment(item.decommissiondate).format('DD/MM/YYYY')}</TableCell>
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

export default AreaModel;
