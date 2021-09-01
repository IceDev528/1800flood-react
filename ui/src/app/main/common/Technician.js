import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ApiService from 'app/services/apiService';

const useStyles = makeStyles(theme => ({
	name: {
		fontSize: 14
	},
	phone: {
		fontSize: 12
	}
}));

function Technician(props) {
	const { tech } = props;
	const [state, setState] = useState(tech);
	const classes = useStyles(tech);
	const [edit, setEdit] = useState(false);

	const handleChange = props => event => {
		setState({ ...state, [props]: event.target.value });
	};

	const onEdit = () => {
		setEdit(true);
	};

	const onDelete = () => {
		props.onDelete(state)
	};

	const onSave = () => {
		ApiService.updateTechnician(state)
			.then(data => {
				console.log(data);
			})
			.catch(err => {
				console.log(err);
			});
		setEdit(false);
	};

	const onCancel = () => {
		setEdit(false);
	};

	return (
		<Grid item xs={3}>
			{edit === false ? (
				<div>
					<div className={classes.name}>{state.name}</div>
					<div className={classes.phone}>{state.mobile}</div>
					<div>
						<IconButton aria-label="edit" onClick={onEdit} className="text-amber">
							<Icon>edit</Icon>
						</IconButton>
						<IconButton onClick={onDelete} className="text-red">
							<Icon>delete</Icon>
						</IconButton>
					</div>
				</div>
			) : (
				<div>
					<div className={classes.name}>
						<Input type="text" required value={state.name} onChange={handleChange('name')} />
					</div>
					<div className={classes.phone}>
						<Input type="text" required value={state.mobile} onChange={handleChange('mobile')} />
					</div>
					<div>
						<IconButton aria-label="Save" color="primary" onClick={onSave} className="text-green">
							<Icon>check</Icon>
						</IconButton>
						<IconButton onClick={onCancel} className="text-red">
							<Icon>cancel</Icon>
						</IconButton>
					</div>
				</div>
			)}
		</Grid>
	);
}

export default Technician;
