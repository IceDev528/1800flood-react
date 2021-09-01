import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Formsy from 'formsy-react';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tabs from '@material-ui/core/Tabs';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import React, { useState, useRef, useEffect } from 'react';
import { TextFieldFormsy } from '@fuse/core/formsy';
import { Link, useHistory } from 'react-router-dom';
import ApiService from 'app/services/ApiService';
import * as authActions from 'app/auth/store/actions';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.secondary.dark} 0%, ${darken(
			theme.palette.secondary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

function Login() {
	const classes = useStyles();
	const [isFormValid, setIsFormValid] = useState(false);
	const formRef = useRef(null);
	const history = useHistory();
	const [error, setError] = useState(false);

	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);

	useEffect(() => {
		if (login.error && (login.error.email || login.error.password)) {
			setError(true);
			disableButton();
		}
	}, [login.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		dispatch(authActions.submitLogin(model));
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<img className="w-128 mb-32" src="assets/images/logos/logo.png" alt="logo" />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h3" color="inherit" className="font-light">
						Welcome to 1800FLOOD!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
					</Typography>
				</FuseAnimate>
			</div>

			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
						<div className="w-full p-20">
							<Typography variant="h6" className="text-center md:w-full mb-48">
								Login
							</Typography>
						</div>
						{error === true && (
							<div className="w-full">
								<Alert severity="error">User name and password does not match or your account is not activated. Please try again.</Alert>
							</div>
						)}
						<div className="w-full">
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
									name="email"
									variant="outlined"
									label="Email"
									value=""
									validations={{
										minLength: 6,
										isEmail: true,
									}}
									validationErrors={{
										minLength: 'Min character length is 6',
										isEmail: 'Please enter an email.',
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
										minLength: 6
									}}
									validationErrors={{
										minLength: 'Min character length is 6'
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
									aria-label="LOG IN"
									disabled={!isFormValid}
									value="legacy"
								>
									Login
								</Button>
							</Formsy>
						</div>
						<div className="flex flex-col items-center justify-center pt-32">
							<span className="font-medium">Don't have an account?</span>
							<Link className="font-medium" to="/register">
								Create an account
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default Login;
