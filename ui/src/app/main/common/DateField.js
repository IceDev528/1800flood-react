import React, { useState, useEffect } from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';

function DateField(props) {
	const { value } = props;
	const [state, setState] = useState(value);
	const [edit, setEdit] = useState(false);

	const dateFormat = 'DD/MM/YYYY hh:mm:ss';

	useEffect(() => {
		setState(moment(props.value).format('YYYY-MM-DD'));
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

	const onChangeDate = event => {
		const val = event.target.value;
		setState(val);
	};

	const formatDate = dt => {
		return moment(dt).format('DD/MM/YYYY');
	};

	return (
		<div>
			{edit === false ? (
				<Grid container spacing={1}>
					<Grid item xs={1}>
						<IconButton aria-label="edit" size="small" onClick={onEdit} className="text-amber">
							<Icon>edit</Icon>
						</IconButton>
					</Grid>
					<Grid item xs={11}>
						<div>{formatDate(state)}</div>
					</Grid>
				</Grid>
			) : (
				<Grid container spacing={1}>
					<Grid item xs={4}>
						<Input type="date" value={state} onChange={onChangeDate} />
					</Grid>
					<Grid item xs={2}>
						<IconButton aria-label="edit" size="small" onClick={onSave} className="text-green">
							<Icon>check</Icon>
						</IconButton>
						<IconButton aria-label="edit" size="small" onClick={onCancel} className="text-red">
							<Icon>cancel</Icon>
						</IconButton>
					</Grid>
				</Grid>
			)}
		</div>
	);
}

export default DateField;
