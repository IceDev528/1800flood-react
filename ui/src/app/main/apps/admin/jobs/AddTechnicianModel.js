import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ApiService from 'app/services/apiService';

function AddTechnicianModel(props) {
	const initState = {
		name: '',
		mobile: ''
	};

	const [tech, setTech] = useState(initState);
	const { jobid } = props;
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(props.open);
		setTech(initState);
	}, [props]);

	const handleChange = props => event => {
		// validate if you want
		setTech({ ...tech, [props]: event.target.value });
	};

	const onSave = () => {
		props.onSave(tech);
	};

	const onClose = () => {
		setOpen(false);
	};
	return (
		<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title">Add Technician</DialogTitle>
			<DialogContent>
				<div>
					<FormControl>
						<InputLabel>Name:</InputLabel>
						<Input id="name" value={tech.name} onChange={handleChange('name')} />
					</FormControl>
				</div>
				<div>
					<FormControl>
						<InputLabel>Mobile:</InputLabel>
						<Input id="mobile" value={tech.mobile} onChange={handleChange('mobile')} />
					</FormControl>
				</div>
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

export default AddTechnicianModel;
