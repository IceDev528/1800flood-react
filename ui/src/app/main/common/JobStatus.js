import React, { useState, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ApiService from 'app/services/apiService';
import { Grid } from '@material-ui/core';

function JobStatus(props) {
	
	const { status, jobId } = props;
	const [state, setState] = useState(status);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		setState(props.status);
	}, [props]);

	const handleChange = event => {
		setState(event.target.value);
		ApiService.updateField(jobId, 'STATUS', event.target.value)
		.then(data => {
			//props.onSave();
		})
		.catch(err => {
			//props.onError();
		});
		setEdit(false);
	};

	const onEdit = () => {
		setEdit(true);
	};

	const onCancel = () => {
		setEdit(false);
	};

	return (
		<Grid container>
			{edit === false ? 
				(<Grid container>
					<Grid item xs={1}>
						<IconButton aria-label="edit" onClick={onEdit}  size="small" className="text-amber">
							<Icon>edit</Icon>
						</IconButton>
					</Grid>
					<Grid item xs={11}>
						{state}
					</Grid>
				</Grid>) : (
				<Grid container>
					<Grid item xs={12}>
						<Select className="w-200" value={state} onChange={handleChange}>
							<MenuItem value="OPEN">OPEN</MenuItem>
							<MenuItem value="NOT-STARTED">NOT-STARTED</MenuItem>
							<MenuItem value="CLOSED">CLOSED</MenuItem>
							<MenuItem value="UNPAID">UNPAID</MenuItem>
							<MenuItem value="ESTIMATES">ESTIMATES</MenuItem>
						</Select>
						<IconButton onClick={onCancel} className="text-red">
							<Icon>cancel</Icon>
						</IconButton>
					</Grid>
				</Grid>
			)}
		</Grid>
	);
};

export default JobStatus;