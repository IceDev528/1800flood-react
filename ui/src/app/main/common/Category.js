import React, { useState, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ApiService from 'app/services/ApiService';
import { Grid } from '@material-ui/core';

function Category(props) {
	const { category, jobId } = props;
	const [state, setState] = useState(category);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		setState(props.category);
	}, [props]);

	const handleChange = event => {
		setState(event.target.value);
		ApiService.updateField(jobId, 'CATEGORY', event.target.value)
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
						<IconButton aria-label="edit" onClick={onEdit} size="small" className="text-amber">
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
							<MenuItem value="Category1">Category 1 - Clear Water</MenuItem>
							<MenuItem value="Category2">Category 2 - Gray Water</MenuItem>
							<MenuItem value="Category3">Category 3 - Sewage Water</MenuItem>
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

export default Category;
