import React, { useState, useEffect } from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';

function EditField(props) {
	const { value } = props;
	const [state, setState] = useState(value);
	const [edit, setEdit] = useState(false);

	const dateFormat = 'DD/MM/YYYY hh:mm:ss';

	useEffect(() => {
		setState(props.value);
	}, [props]);

	const onEdit = () => {
		setEdit(true);
	};

	const onSave = () => {
		setEdit(false);
		props.handleChange({ target: { value: state } });
	};

	const onCancel = () => {
		setEdit(false);
	};

	const onChange = event => {
		setState(event.target.value);
	};

	const formatDate = dt => {
		return moment(dt).format('DD/MM/YYYY');
	};

	return (
		<div>
			{edit === false ? (
				<Grid container>
					<Grid item xs={2}>
						<IconButton aria-label="edit" size="small" onClick={onEdit} className="text-amber">
							<Icon>edit</Icon>
						</IconButton>
					</Grid>
					<Grid item xs={10}>
						<div>{state}</div>
					</Grid>
				</Grid>
			) : (
				<Grid container>
					<Grid item xs={4}>
						<Input type="number" value={state} onChange={onChange} />
					</Grid>
					<Grid item xs={2}>
						<IconButton
							className="text-green"
							aria-label="edit"
							color="primary"
							size="small"
							onClick={onSave}
						>
							<Icon>check</Icon>
						</IconButton>
						<IconButton className="text-red" aria-label="edit" size="small" onClick={onCancel}>
							<Icon>cancel</Icon>
						</IconButton>
					</Grid>
				</Grid>
			)}
		</div>
	);
}

export default EditField;
