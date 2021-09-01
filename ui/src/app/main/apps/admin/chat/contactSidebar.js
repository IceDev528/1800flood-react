import FuseScrollbars from '@fuse/core/FuseScrollbars';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';

function ContactSidebar(props) {
	const dispatch = useDispatch();
	const selectedChannel = useSelector(({ chatApp }) => chatApp.channel);

	return (
		<div className="flex flex-col flex-auto h-full">
			<AppBar position="static" color="primary" elevation={1}>
				<Toolbar className="flex justify-between items-center px-4">
					<Typography className="px-12" color="inherit" variant="subtitle1">
						Contact Info
					</Typography>
					<IconButton onClick={() => dispatch(Actions.closeContactSidebar())} color="inherit">
						<Icon>close</Icon>
					</IconButton>
				</Toolbar>

				<Toolbar className="flex flex-col justify-center items-center p-24">
					<Typography color="inherit" className="mt-16" variant="h6">
						{selectedChannel.firstname} {selectedChannel.lastname}
					</Typography>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default ContactSidebar;
