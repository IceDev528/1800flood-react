import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import moment from 'moment';
import DateField from 'app/main/common/DateField';
import ApiService from 'app/services/ApiService';

const useStyles = makeStyles(theme => ({
	border: {
		bordeWidth: 1,
		borderColor: theme.primary,
		borderStyle: 'solid',
		borderRadius: 10
	},
	name: {
		fontSize: 14
	},
	phone: {
		fontSize: 12
	},
	progress: {
		width: 100,
		minWidth: 40
	}
}));

function Area(props) {
	const classess = useStyles();

	const { area } = props;
	const [state, setState] = useState(area);
	const [edit, setEdit] = useState(false);

	const valuetext = text => {
		return `{text * 100}%`;
	};

	const handleSliderChange = props => (event, newVal) => {
		const value = newVal / 100;
		setState({ ...state, [props]: value });
	};

	const handleChange = props => event => {
		setState({ ...state, [props]: event.target.value });
	};

	const handleDateChange = props => event => {
		setState({ ...state, decomissiondate: event.target.value });
	};

	const onEdit = () => {
		setEdit(true);
	};

	const onDelete = () => {
		props.onDelete(state);
	};

	const onSave = () => {
		console.log(state);
		ApiService.updateArea(state)
			.then(data => {
				//props.onSave();
			})
			.catch(err => {
				//props.onError();
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
					<div>Name: {state.name}</div>
					<div>AirMovers: {state.airmovers}</div>
					<div>Dehumidifier: {state.dehumidifier}</div>
					<div>AFD: {state.afd}</div>
					<div>Goal: {state.goal * 100}%</div>
					<div>Progress: {state.progress * 100}%</div>
					<div className="font-12">
						Decommission Date: {moment(state.decomissiondate).format('DD/MM/YYYY')}
					</div>
					<IconButton aria-label="edit" onClick={onEdit} className="text-amber">
						<Icon>edit</Icon>
					</IconButton>
					<IconButton onClick={onDelete} className="text-red">
						<Icon>delete</Icon>
					</IconButton>
				</div>
			) : (
				<div>
					<div>
						<Input
							type="text"
							placeholder="Name"
							required
							value={state.name}
							onChange={handleChange('name')}
						/>
					</div>
					<div>
						<Input
							type="number"
							placeholder="Air movers"
							required
							value={state.airmover}
							onChange={handleChange('airmover')}
						/>
					</div>
					<div>
						<Input
							type="number"
							placeholder="Dehumidifier"
							required
							value={state.dehumidifier}
							onChange={handleChange('dehumidifier')}
						/>
					</div>
					<div>
						<Input
							type="number"
							placeholder="AFD"
							required
							value={state.afd}
							onChange={handleChange('afd')}
						/>
					</div>
					<div className={classess.progress}>
						Goal:
						<Slider
							defaultValue={state.goal * 100}
							getAriaValueText={valuetext}
							aria-labelledby="Goal"
							step={10}
							marks
							min={0}
							max={100}
							valueLabelDisplay="auto"
							onChange={handleSliderChange('goal')}
						/>
					</div>
					<div className={classess.progress}>
						Progress:
						<Slider
							defaultValue={state.progress * 100}
							getAriaValueText={valuetext}
							aria-labelledby="Progress"
							step={10}
							marks
							min={0}
							max={100}
							valueLabelDisplay="auto"
							onChange={handleSliderChange('progress')}
						/>
					</div>
					<div className={classess.progress}>
						Decomission Date:
						<DateField
							date={state.decomissiondate}
							handleChange={handleDateChange}
							placeholder="Decomission Date"
						/>
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

export default Area;
