import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { Menu, MenuItem } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const statusArr = [
	{
		title: 'All',
		value: 'ALL'
	},
	{
		title: 'Open',
		value: 'OPEN'
	},
	{
		title: 'Not started',
		value: 'NOT-STARTED'
	},
	{
		title: 'Closed',
		value: 'CLOSED'
	},
	{
		title: 'Unpaid',
		value: 'UNPAID'
	},
	{
		title: 'Estimates',
		value: 'ESTIMATES'
	}
];

function JobsHeader(props) {

	const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);

	const [state, setState] = useState('');
	const [filter, setFilter] = useState('OPEN');
	const [statusMenuEl, setStatusMenuEl] = useState(null);
	const [moreMenuEl, setMoreMenuEl] = useState(null);

	function handleMoreMenuClick(event) {
		setMoreMenuEl(event.currentTarget);
	}

	function handleMoreMenuClose(event) {
		setMoreMenuEl(null);
	}

	function handleStatusMenuClick(event) {
		event.preventDefault();
		event.stopPropagation();
		setStatusMenuEl(event.currentTarget);
	}

	function handleStatusSelect(event, status) {
		event.preventDefault();
		event.stopPropagation();
		setFilter(status);
		props.onFilter(status);
		setStatusMenuEl(null);
	}

	function handleStatusClose(event) {
		event.preventDefault();
		event.stopPropagation();
		setStatusMenuEl(null);
	}

	const handleChange = e => {
		setState(e.target.value);
		props.onSearch(e.target.value);
	};

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="color-white hidden sm:flex mx-0 sm:mx-12" variant="h6">
						Estimates and Jobs
					</Typography>
				</FuseAnimate>
			</div>
			<div className="flex items-center">
				<FuseAnimate animate="transition.slideLeftIn" deplay={200}>
					<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
						<Icon color="action">search</Icon>
						<Input
							placeholder="Search"
							className="flex flex-1 mx-8"
							disableUnderline
							fullWidth
							value={state}
							onChange={handleChange}
							inputProps={{
								'aria-label': 'Search'
							}}
						/>
					</Paper>
				</FuseAnimate>
			</div>
			<FuseAnimate animation="transition.slideRightIn" delay={300}>
				<Button
					component={Link}
					to="/apps/admin/jobs/new"
					className="whitespace-no-wrap normal-case"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Add Quote</span>
					<span className="flex sm:hidden">New</span>
				</Button>
			</FuseAnimate>
			<div
				className="cursor-pointer"
				aria-owns={statusMenuEl ? 'switch-menu' : null}
				aria-haspopup="true"
				onClick={handleStatusMenuClick}
				onKeyDown={handleStatusMenuClick}
				role="button"
				tabIndex={0}
			>
				View By : {filter}
			</div>

			<Menu id="status-switch" anchorEl={statusMenuEl} open={Boolean(statusMenuEl)} onClose={handleStatusClose}>
				{statusArr.map(status => (
					<MenuItem onClick={ev => handleStatusSelect(ev, status.value)} key={status.value}>
						<ListItemText primary={status.title} />
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}

export default JobsHeader;
