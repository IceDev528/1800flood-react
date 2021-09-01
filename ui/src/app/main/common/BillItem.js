import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import ApiService from 'app/services/apiService';

const useClasses = makeStyles(theme=>({
	smallText: {
		width: 30,
		textAlign: "center"
	}
}));

function BillItem(props) {
	const { item } = props;
	const [ state, setState ] = useState(item);
	const classes = useClasses();

	const formatDollar = item => {
		const number = parseFloat(item);
		return `$ ${number.toFixed(2)}`;
	};

	const onChange = event => {
		setState({
			...state,
			qty: event.target.value,
			amount: (item.amount / item.qty) * event.target.value
		});
		if (event.target.value !== '') {
			props.handleChange({
				...state,
				qty: event.target.value,
				amount: (item.amount / item.qty) * event.target.value
			});
		}
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={9}>{state.name}</Grid>
			<Grid item xs={1}>
				<Input className={classes.smallText} type="text" value={state.qty} onChange={onChange} />
			</Grid>
			<Grid item xs={2}>{formatDollar(state.amount)}</Grid>
		</Grid>
	);
};

export default BillItem;

