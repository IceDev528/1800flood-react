import FusePageCarded from '@fuse/core/FusePageCarded';

import FuseAnimate from '@fuse/core/FuseAnimate';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ApiService from 'app/services/ApiService';
import FLAlert from 'app/main/common/FLAlert';
import PaymentMethodDropdown from 'app/main/common/PaymentMethodDropdown';
import AddPriceItemDialog from './SettingDialog';

const useStyles = makeStyles(theme => ({
	layoutRoot: {},
	fullWidth: {
		width: '100%'
	}
}));

function SettingItem(props) {
	const classes = useStyles();
	const { name, value, settingid } = props;
	const dispatch = useDispatch();
	const [state, setState] = useState(value);

	const handleChange = event => {
		setState(event.target.value);
		props.onChange(settingid, event.target.value);
	};

	const onDelete = id => event => {
		ApiService.deleteSetting(id).then(e => {
			props.onDelete(id);
			dispatch(
				MessageActions.showMessage({
					message: 'Bill item is deleted.', //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'center' //left center right
					},
					variant: 'success'
				})
			);
		});
	};

	return (
		<div className="p-12">
			<Grid container spacing={2}>
				<Grid item xs={10}>
					<TextField
						key={settingid}
						type="number"
						size="small"
						className={classes.fullWidth}
						label={name}
						value={state || ''}
						onChange={handleChange}
						variant="outlined"
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>
						}}
					/>
				</Grid>
				<Grid item xs={2}>
					{settingid > 13 ? (
						<IconButton size="small" onClick={onDelete(settingid)} className="text-red">
							<Icon>delete</Icon>
						</IconButton>
					) : (
						''
					)}
				</Grid>
			</Grid>
		</div>
	);
}

function SettingsPage(props) {
	const classes = useStyles(props);
	const dispatch = useDispatch();
	const [settings, setSettings] = useState([]);
	const [dialog, setDialog] = useState(false);

	const onChange = (id, value) => {
		ApiService.updateSetting(id, value);
	};

	const onSave = setting => {
		console.log(setting);
		ApiService.addSetting(setting)
			.then(response => {
				console.log('Save settings');
				setSettings(settings.concat(response.data));
				setDialog(false);
				dispatch(
					MessageActions.showMessage({
						message: 'Bill item is added',
						autoHideDuration: 6000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);
			})
			.catch(err => {
				console.log('Error', err);
				setDialog(true);
			});
		console.log(settings);
	};
	const onDelete = id => {
		setSettings(settings.filter(f => f.settingid !== id));
	};
	useEffect(() => {
		ApiService.getSettings().then(data => {
			console.log(data.data);
			setSettings(data.data);
		});
	}, []);
	return (
		<FusePageCarded
			classes={{
				root: classes.layoutRoot,
				header: 'min-h-50 h-50 sm:h-120 sm:min-h-120'
			}}
			header={
				<div className="flex flex-1 w-full items-center justify-between">
					<h4>Settings</h4>
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<div>
							<Button
								className="whitespace-no-wrap mr-10 normal-case"
								variant="contained"
								color="secondary"
								onClick={() => {
									setDialog(true);
								}}
							>
								Add Bill Item
							</Button>
						</div>
					</FuseAnimate>
				</div>
			}
			content={
				<div className="p-24">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper elevation={0}>
								<div className="p-12">
									<PaymentMethodDropdown />
								</div>
								{(settings || []).map(item => (
									<SettingItem
										name={item.name}
										value={item.value}
										settingid={item.settingid}
										onChange={onChange}
										onDelete={onDelete}
									/>
								))}
								<AddPriceItemDialog
									onSave={onSave}
									onClose={() => {
										setDialog(false);
									}}
									open={dialog}
								/>
							</Paper>
						</Grid>
					</Grid>
				</div>
			}
		/>
	);
}

export default SettingsPage;
