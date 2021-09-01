import React from 'react';
import Typography from '@material-ui/core/Typography';

function Label(props) {
	return (
		<Typography className="font-16 font-bold p-10">
			{props.children}
		</Typography>
	);
}

export default Label;