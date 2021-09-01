import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ApiService from 'app/services/ApiService';

function AddPriceItemDialog(props) {
	const initState = {
		name: '',
		value: 0
	};
	const { open } = props;
	const [sett, setSett] = useState(initState);

	useEffect(() => {
		setSett(initState);
	}, [props]);

	const handleChange = props => event => {
		setSett({ ...sett, [props]: event.target.value });
	};

	const onSave = () => {
		props.onSave(sett);
	};

	const onClose = () => {
		props.onClose();
	};
	return (
		<Dialog onClose={onClose} aria-labelledby="add-setting-dialog" open={open}>
			<DialogTitle id="simple-dialog-title">Add Price Item</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							style={{width: "100%"}}
							label="name"
							value={sett.name}
							variant="outlined"
							size="small"
							onChange={handleChange('name')}
							autoFocus
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							style={{width: "100%"}}
							label="value"
							value={sett.value}
							variant="outlined"
							size="small"
							type="number"
							onChange={handleChange('value')}
						/>
					</Grid>
				</Grid>
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

export default AddPriceItemDialog;
