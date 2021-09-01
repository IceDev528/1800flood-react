import { TextFieldFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import * as authActions from 'app/auth/store/actions';
import Formsy from 'formsy-react';
import React, { useEffect, useRef, useState } from 'react';
import ApiService from 'app/services/ApiService';
import { useHistory } from 'react-router-dom';

function RegisterTab(props) {
	const [isFormValid, setIsFormValid] = useState(false);
	const [success, setSuccess] = useState(false);
	const [err, setErr] = useState('');
	const history = useHistory();
	const formRef = useRef(null);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		console.log(model);
		ApiService.registerUser(model).then(data => {
			console.log(data);
			setSuccess(true);
		}).catch(err => {
			setErr(err);
		});
		
	}

	return (
		<div className="w-full">
			{!success && (
				<Formsy
					onValidSubmit={handleSubmit}
					onValid={enableButton}
					onInvalid={disableButton}
					ref={formRef}
					className="flex flex-col justify-center w-full"
				>
					<TextFieldFormsy
						className="mb-16"
						type="text"
						name="customer"
						label="Company name"
						variant="outlined"
						validations={{
							minLength: 6
						}}
						validationErrors={{
							minLength: 'Min character length is 4'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										person
									</Icon>
								</InputAdornment>
							)
						}}
					/>
					<Grid container spacing={2}>
						<Grid item xs={6} spacing={2}>
							<TextFieldFormsy
								className="mb-16"
								type="text"
								name="firstName"
								label="First Name"
								variant="outlined"
								validations={{
									minLength: 4
								}}
								validationErrors={{
									minLength: 'Min character length is 4'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												person
											</Icon>
										</InputAdornment>
									)
								}}
								required
							/>
						</Grid>
						<Grid item xs={6}>
							<TextFieldFormsy
								className="mb-16"
								type="text"
								name="lastName"
								label="Last name"
								variant="outlined"
								validations={{
									minLength: 4
								}}
								validationErrors={{
									minLength: 'Min character length is 4'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												person
											</Icon>
										</InputAdornment>
									)
								}}
								required
							/>
						</Grid>
					</Grid>
					<TextFieldFormsy
						className="mb-16"
						type="number"
						name="mobile"
						label="Mobile"
						variant="outlined"
						validations={{
							minLength: 4,
							isNumeric: true
						}}
						validationErrors={{
							minLength: 'Min character length is 10',
							isNumeric: 'Please enter valid mobile number'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										phone
									</Icon>
								</InputAdornment>
							)
						}}
						required
					/>

					<TextFieldFormsy
						className="mb-16"
						type="text"
						name="email"
						label="Email"
						variant="outlined"
						validations="isEmail"
						validationErrors={{
							isEmail: 'Please enter a valid email'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										email
									</Icon>
								</InputAdornment>
							)
						}}
						required
					/>

					<TextFieldFormsy
						className="mb-16"
						type="password"
						name="password"
						label="Password"
						variant="outlined"
						validations={{
							equalsField: "password-confirm",
							minLength: 6,
							isAlphanumeric: true,
							matchRegexp: /[A-Z]+/
						}}
						validationErrors={{
							equalsField: 'Passwords do not match',
							minLength: 'Please enter more than 6 characters',
							isAlphanumeric: 'Please enter alpha numeric Value',
							matchRegexp: 'Password must contain one upper case letter'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										vpn_key
									</Icon>
								</InputAdornment>
							)
						}}
						required
					/>

					<TextFieldFormsy
						className="mb-16"
						type="password"
						name="password-confirm"
						label="Confirm Password"
						variant="outlined"
						validations="equalsField:password"
						validationErrors={{
							equalsField: 'Passwords do not match'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										vpn_key
									</Icon>
								</InputAdornment>
							)
						}}
						required
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="w-full mx-auto mt-16 normal-case"
						aria-label="REGISTER"
						disabled={!isFormValid}
						value="legacy"
					>
						Register
					</Button>
				</Formsy>
			)}
			{success && (
				<Alert severity="success">
					Thanks for your registration. You will receive an email once your account is activated.
				</Alert>
			)}
		</div>
	);
}

export default RegisterTab;
