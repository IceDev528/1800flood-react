import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import CustomerDropdown from './CustomerDropdown';
import AddCustomerModel from './AddCustomerModel';

function Customer(props) {
	const { customer } = props;
	const [edit, setEdit] = useState(false);
	const [add, setAdd] = useState(false);
	const [state, setState] = useState({
		name: '',
		billingemail: '',
		phonenumber: '',
		customerid: 0,
	});

	useEffect(() => {
		setState(customer);
	}, [props]);

	const onChange = cust => {
		console.log(cust);
		setState(cust);
		setEdit(false);
		// update customer id in job
		props.onUpdate(cust);
	};

	const onCustomerAdd = newCustomer => {
		setAdd(false);
		props.onCustomerAdd(newCustomer);
	};
	return (
		<div>
			{edit === true ? (
				<Grid container>
					<Grid item xs={3}>
						<Typography variant="subtitle1">Select:</Typography>
					</Grid>
					<Grid item xs={5}>
						<CustomerDropdown customerid={customer.customerid} onChange={onChange} />
					</Grid>
					<Grid item xs={2}>
						<IconButton
							size="small"
							onClick={() => {
								setEdit(false);
							}}
							className="text-red"
						>
							<Icon>cancel</Icon>
						</IconButton>
					</Grid>
				</Grid>
			) : (
				<Grid container>
					<Grid item xs={12}>
						<strong>Name: </strong> {state.name}
						<IconButton
							size="small"
							onClick={() => {
								setEdit(true);
							}}
							className="text-amber"
						>
							<Icon>edit</Icon>
						</IconButton>
						<IconButton
							size="small"
							onClick={() => {
								setAdd(true);
							}}
							className="text-green"
						>
							<Icon>add</Icon>
						</IconButton>
					</Grid>
					<Grid item xs={6}>
						<strong>Email: </strong> <a href={'mailto:' + state.billingemail}>{state.billingemail}</a>
					</Grid>
					<Grid item xs={6}>
						<strong>Mobile: </strong> {state.phonenumber}
					</Grid>
				</Grid>
			)}
			<AddCustomerModel
				open={add}
				onSave={onCustomerAdd}
				onClose={() => {
					setAdd(false);
				}}
			/>
		</div>
	);
}

export default Customer;
