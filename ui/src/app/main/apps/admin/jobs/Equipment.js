import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function Equipment(props) {
	const { name, count } = props;

	const onClick = () => {
		props.onClick();
	};

	return (
		<Card style={{ marginBottom: '15px' }}>
			<CardHeader className="text-center bg-gray" title={name} />
			<CardContent className="text-center cursor-pointer" onClick={onClick}>
				<Typography variant="h5">{count}</Typography>
			</CardContent>
		</Card>
	);
}

export default Equipment;