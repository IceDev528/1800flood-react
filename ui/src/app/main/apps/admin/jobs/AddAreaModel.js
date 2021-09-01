import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import ApiService from 'app/services/ApiService';

const useStyle = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 150
	}
}));

function AddAreaModel(props) {
	const classes = useStyle();
	const { jobId } = props;
	const initState = {
		name: '',
		airmovers: 0,
		dehumidifier: 0,
		afd: 0,
		goal: 0.0,
		decommissiondate: new Date(),
		jobid: jobId
	};
	const [area, setArea] = useState(initState);
	const [open, setOpen] = useState(props.open);

	useEffect(() => {
		setOpen(props.open);
	}, [props]);

	const handleChange = props => event => {
		// validate if you want
		setArea({ ...area, [props]: event.target.value });
	};

	const handleSliderChange = (event, newValue) => {
		setArea({ ...area, goal: newValue / 100 });
	};

	const handleDateChange = props => event => {
		setArea({ ...area, decommissiondate: event });
	};

	const handleClose = () => {
		setOpen(false);
		props.onClose();
	};

	const onSave = () => {
		console.log(area);
		props.onSave(area);
	};

	const onClose = () => {
		props.onClose();
	};

	const valuetext = value => {
		return `${value * 100}%`;
	};
	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title">New Area</DialogTitle>
			<DialogContent>
				<Box display="flex" flexDirection="column">
					<Box display="flex" order={1}>
						<FormControl className={classes.formControl}>
							<TextField
								id="name"
								placeholder="Area name"
								label="Area Name"
								value={area.name}
								variant="outlined"
								onChange={handleChange('name')}
							/>
						</FormControl>
					</Box>
					<Box display="flex" order={1}>
						<Box display="flex" flexDirection="row">
							<Box display="flex" order={1}>
								<FormControl className={classes.formControl}>
									<TextField
										id="airmover"
										value={area.airmovers}
										type="number"
										variant="outlined"
										onChange={handleChange('airmovers')}
									/>
								</FormControl>
							</Box>
							<Box display="flex" order={1}>
								<FormControl className={classes.formControl}>
									<TextField
										id="dehumidifier"
										value={area.dehumidifier}
										type="number"
										onChange={handleChange('dehumidifier')}
									/>
								</FormControl>
							</Box>
							<Box display="flex" order={1}>
								<FormControl className={classes.formControl}>
									<InputLabel>AFD:</InputLabel>
									<Input id="afd" value={area.afd} type="number" onChange={handleChange('afd')} />
								</FormControl>
							</Box>
						</Box>
					</Box>
					<Box display="flex" order={1}>
						<FormControl className={classes.formControl}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									disableToolbar
									autoOk
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="Date of Decommission"
									value={area.decommissiondate}
									onChange={handleDateChange('decommissiondate')}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</MuiPickersUtilsProvider>
						</FormControl>
					</Box>
					<Box display="flex" order={1}>
						<FormControl className={classes.formControl}>
							<InputLabel>Goal:</InputLabel>
							<Slider
								defaultValue="0.0"
								value={area.progress}
								getAriaValueText={valuetext}
								aria-labelledby="Goal"
								step={10}
								marks
								min={0}
								max={100}
								valueLabelDisplay="auto"
								onChange={handleSliderChange}
							/>
						</FormControl>
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={onSave}>
					Save
				</Button>
				<Button variant="contained" color="secondary" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AddAreaModel;
