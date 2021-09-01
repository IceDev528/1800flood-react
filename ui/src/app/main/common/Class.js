import React, { useState, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ApiService from 'app/services/ApiService';
import Grid from '@material-ui/core/Grid';

function Class(props) {
	
	const { level, jobId } = props;
	const [state, setState] = useState(level);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		setState(props.level);
	}, [props]);

	const handleChange = event => {
		setState(event.target.value);
		ApiService.updateField(jobId, 'CLASS', event.target.value)
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
				(<Grid container spacing={2}>
					<Grid item xs={1}>
						<IconButton aria-label="edit" onClick={onEdit} size="small" className="text-amber">
							<Icon>edit</Icon>
						</IconButton>
					</Grid>
					<Grid item xs={11}>
						{state}
					</Grid>
				</Grid>) : (
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Select className="w-200" value={state} onChange={handleChange}>
							<MenuItem value="Class1">Class 1</MenuItem>
							<MenuItem value="Class2">Class 2</MenuItem>
							<MenuItem value="Class3">Class 3</MenuItem>
							<MenuItem value="Class4">Class 4</MenuItem>
							<MenuItem value="Class5">Class 5</MenuItem>
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

export default Class;