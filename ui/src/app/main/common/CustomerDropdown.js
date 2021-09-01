import React, { useEffect, useState } from 'react';
import { TextField, Typography, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ApiService from 'app/services/ApiService';

function CustomerDropdown (props) {

	const [list, setList] = useState([{}]);
	const [state, setState] = useState(0);
	const { id } = props;

	useEffect(() => {
		ApiService.getCustomers()
			.then(response => {
				setList(response.data);
			})
			.then(d => {
				if (id) {
					setState(id);
				}
			});
	}, [props.id]);

	const handleChange = event => {
		setState(event.target.value);
		const customer = list.filter(c => c.customerid === event.target.value);
		props.onChange(customer[0]);
	};

	return(
		<div>
			<TextField
				id="standard-select-currency"
				select
				label="Select Customer"
				value={id}
				size="small"
				onChange={handleChange}
				variant="outlined"
				style={{width: "200px"}}
				>
				{list.map((option, index) => (
					<MenuItem key={index} value={option.customerid}>
						{option.name}
					</MenuItem>
				))}
			</TextField>
		</div>)
}

export default CustomerDropdown;