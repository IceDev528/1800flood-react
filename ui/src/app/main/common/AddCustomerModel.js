import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import ApiService from 'app/services/ApiService';

function AddCustomerModel(props) {

	const initState = {
		name: '',
		phonenumber: '',
		billingemail: ''
	};
	const [customer, setCustomer] = useState(initState);
	const [open, setOpen] = useState(props.open);

	useEffect(() => {
		setOpen(props.open);
	}, [props]);

	const handleChange = props => event => {
		// validate if you want
		setCustomer({ ...customer, [props]: event.target.value });
	};

	const handleClose = () => {
		props.onClose();
	};

	const onSave = () => {
		props.onSave(customer);
	};

	const onClose = () => {
		props.onClose();
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="customer-add-dialog-title" open={open}>
			<DialogTitle id="customer-add-dialog-title">New Customer</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							id="name"
							placeholder="Name"
							label="Name"
							value={customer.name}
							variant="outlined"
							size="small"
							onChange={handleChange('name')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="name"
							type="email"
							placeholder="Billing email"
							label="Email"
							value={customer.billingemail}
							variant="outlined"
							size="small"
							onChange={handleChange('billingemail')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="phone"
							type="number"
							placeholder="Contact number"
							label="Phone Number"
							value={customer.phonenumber}
							variant="outlined"
							size="small"
							onChange={handleChange('phonenumber')}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" className="text-green" onClick={onSave}>
					<Icon>check</Icon>
				</Button>
				<Button variant="contained" className="text-red" onClick={onClose}>
					<Icon>cancel</Icon>
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AddCustomerModel;
