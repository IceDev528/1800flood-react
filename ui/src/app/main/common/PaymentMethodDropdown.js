import React, { useEffect, useState } from 'react';
import { TextField, Typography, MenuItem } from '@material-ui/core';

function PaymentMethodDropdown(props) {
	const [state, setState] = useState({
		paymentMethodId: 1,
		name: '1800FLOOD default payment method'
	});
	return (
		<div>
			<TextField
				id="standard-select-currency"
				select
				size="small"
				label="Select Payment Method"
				value={state.paymentMethodId}
				variant="outlined"
				style={{ width: '100%' }}
			>
				<MenuItem key={state.paymentMethodId} value={state.paymentMethodId}>
					{state.name}
				</MenuItem>
			</TextField>
		</div>
	);
}

export default PaymentMethodDropdown;
