import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, DialogActions } from '@material-ui/core';
import ApiService from 'app/services/apiService';

function AreaItem(props) {
	const { area, index } = props;

	const [state, setState] = useState(area);

	const handleChange = prop => event => {
		const newState = { ...state, [prop]: event.target.value === '' ? '' : parseInt(event.target.value, 10) };
		props.onChange({ state: newState });
		setState(newState);
	};

	return (
		<Grid item xs={12} key={index}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					{state.name}
				</Grid>
				<Grid item xs={2}>
					<TextField
						value={state.airmovers}
						label="AirMovers"
						type="number"
						size="small"
						onChange={handleChange('airmovers')}
						variant="outlined"
						autoFocus
					/>
				</Grid>
				<Grid item xs={2}>
					<TextField
						value={state.dehumidifier}
						label="Dehumidifier"
						type="number"
						size="small"
						onChange={handleChange('dehumidifier')}
						variant="outlined"
					/>
				</Grid>
				<Grid item xs={2}>
					<TextField
						value={state.afd}
						label="AFD"
						type="number"
						size="small"
						onChange={handleChange('afd')}
						variant="outlined"
					/>
				</Grid>
			</Grid>
		</Grid>
	);
}

function EquipmentModel(props) {
	const { areas, open, jobId } = props;

	const [state, setState] = useState([]);

	useEffect(() => {
		setState(props.areas);
	}, [props]);

	const handleChange = props => {
		console.log(props);
		const newState = state.map(area => {
			if (props.state.areaid === area.areaid) {
				return props.state;
			}
			return area;
		});
		setState(newState);
	};

	const handleClick = event => {};

	const handleClose = () => {
		state.map(area => {
			ApiService.updateArea(jobId, area).then(response => {});
		});
		props.onClose(state);
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">Areas</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					{(state || []).map((item, index) => (
						<AreaItem area={item} onChange={handleChange} />
					))}
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

export default EquipmentModel;
