import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ApiService from 'app/services/apiService';

const useStyles = makeStyles(theme => ({
	border: {
		bordeWidth: 1,
		borderColor: theme.primary,
		borderStyle: 'solid',
		borderRadius: 10
	},
	name: {
		fontSize: 14
	},
	phone: {
		fontSize: 12
	}
}));

function Address(props) {
	const classes = useStyles();
	const [address, setAddress] = useState(props.address);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		setAddress(props.address);
	}, [props]);

	const onEdit = () => {
		setEdit(true);
	};

	const onSave = () => {
		ApiService.updateAddress(address).then(data => {
			//props.onSave();
		}).catch(err => {
			//props.onError();
		});
		setEdit(false);
	};

	const onChange = props => event => {
		setAddress({ ...address, [props]: event.target.value });
	};

	const onCancel = () => {
		setEdit(false);
	};

	const onDelete = () => {

	};

	return (
		<div className={classes.border}>
			{edit === false ? (
				<div>{address.addressline1}</div>
			) : (
				<div>
					<Input onChange={onChange('addressline1')} placeholder="Address Line 1" value={address.addressline1} type="text" required />
				</div>
			)}
			{edit === false ? (
				<div>{address.addressline2}</div>
			) : (
				<div>
					<Input onChange={onChange('addressline2')} placeholder="Address Line 2" value={address.addressline2} type="text" required />
				</div>
			)}
			{edit === false ? (
				<div>{address.suburb}</div>
			) : (
				<div>
					<Input onChange={onChange('suburb')} placeholder="suburb" value={address.suburb} type="text" required />
				</div>
			)}
			{edit === false ? (
				<div>{address.state}</div>
			) : (
				<div>
					<Input onChange={onChange('state')} placeholder="state" value={address.state} type="text" required />
				</div>
			)}
			{edit === false ? (
				<div>{address.postcode}</div>
			) : (
				<div>
					<Input onChange={onChange('postcode')} placeholder="postcode" value={address.postcode} type="text" required />
				</div>
			)}
			{edit === false ? (
				<div>{address.contact}</div>
			) : (
				<div>
					<Input onChange={onChange('contact')} placeholder="contact" value={address.contact} type="text" required />
				</div>
			)}
			{edit === false ? (
				<div>
					<IconButton onClick={onEdit} className="text-amber">
						<Icon>edit</Icon>
					</IconButton>
				</div>
			) : (
				<div>
					<IconButton onClick={onSave} className="text-green">
						<Icon>check</Icon>
					</IconButton>
					<IconButton onClick={onCancel} className="text-red">
						<Icon>cancel</Icon>
					</IconButton>
				</div>
			)}
		</div>
	);
}

export default Address;
