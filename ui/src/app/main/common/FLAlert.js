import React, { useState, useEffect } from 'react';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
function FLAlert(props) {
	const { open, type, message } = props;

	const [dialog, setDialog] = useState(false);

	useEffect(() => {
		setDialog(open);
	}, [open]);
	return (
		<Collapse in={dialog}>
			<Alert
				severity={type}
				action={
					<IconButton
						arial-label="close"
						className="text-red"
						size="small"
						onClick={() => {
							setDialog(false);
						}}
					>
						<CloseIcon fontSize="inherit" />
					</IconButton>
				}
			>
				{message}
			</Alert>
		</Collapse>
	);
}

export default FLAlert;
