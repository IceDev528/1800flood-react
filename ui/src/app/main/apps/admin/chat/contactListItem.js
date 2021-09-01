import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';

const useStyles = makeStyles(theme => ({
	contactListItem: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		'&.active': {
			backgroundColor: theme.palette.background.paper
		}
	},
	unreadBadge: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	}
}));

function ContactListItem(props) {
	const classes = useStyles(props);

	return (
		<ListItem
			button
			className={clsx(classes.contactListItem, 'px-16 py-12 min-h-92', {
				active: props.selectecChannel.channelId === props.channel.channelid
			})}
			onClick={() => props.onContactClick(props.channel.channelid)}
		>
			<ListItemText
				classes={{
					root: 'min-w-px px-16',
					secondary: 'truncate'
				}}
				primary={props.contact.name}
				secondary={props.contact.firstname}
			/>
		</ListItem>
	);
}

export default ContactListItem;
