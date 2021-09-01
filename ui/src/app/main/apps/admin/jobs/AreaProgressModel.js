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

function AreaProgressModel(props) {
	const { areas, open, jobId } = props;
	const initState = { name: '', progress: 0 };
	const [area, setArea] = useState(initState);
	const [areaList, setAreaList] = useState(areas);

	useEffect(() => {
		setAreaList(areas);
	}, [props]);

	const updateProgress = area => {
		const newList = areaList.map(a => {
			if (a.areaid === area.areaid) {
				return area;
			}
			return a;
		});
		setAreaList(newList);
	};

	const handleClose = () => {
		areaList.map(a => {
			ApiService.updateArea(jobId, a);
		});
		props.onClose(areaList);
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">Area Progress</DialogTitle>
			<DialogContent>
				<Grid container>
					<Grid item xs={12}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Progress</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(areaList || []).map((area, index) => (
									<TableRow>
										<TableCell>{area.name}</TableCell>
										<TableCell>
											<TextField 
												onChange={e => updateProgress({ ...area, progress: e.target.value })}
												size="small"
												type="number"
												placeholder="Progress"
												label="progress"
												variant="outlined"
												value={area.progress}
											/>
										</TableCell>
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

export default AreaProgressModel;
