import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseAnimate from '@fuse/core/FuseAnimate';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import ApiService from 'app/services/apiService/apiService';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Switch from '@material-ui/core/Switch';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import RemoveIcon from '@material-ui/icons/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import FLAlert from 'app/main/common/FLAlert';
import Category from 'app/main/common/Category';
import CustomerDropdown from 'app/main/common/CustomerDropdown';
import Class from 'app/main/common/Class';
import Label from 'app/main/common/Label';
import Area from 'app/main/common/Area';
import AddAreaModel from './AddAreaModel';
import Equipment from './Equipment';

const useStyles = makeStyles(theme => ({
	line: {
		padding: '10px',
		borderBottom: '1px solid #888888'
	},
	formControl: {
		marginBottom: theme.spacing(1),
		marginRight: theme.spacing(1),
		minWidth: 100,
		width: 200
	},
	table: {
		padding: 2
	}
}));

function EquipmentModel(props) {
	const { open, label, field, count } = props;

	const [state, setState] = useState(count);

	const handleChange = event => {
		setState(event.target.value);
	};

	const handleClose = () => {
		props.onClose({ label, state, field });
	};
	return (
		<Dialog onClose={handleClose} aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">{label}</DialogTitle>
			<DialogContent>
				<Typography variant="body1"># of {label} required?</Typography>
				<TextField AutoFocus type="number" onChange={handleChange} variant="outlined" size="small" value={state} />
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="secondary" onClick={handleClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function AreaModel(props) {
	const { open } = props;

	const [state, setState] = useState([]);
	const [area, setArea] = useState({ name: '', goal: '' });

	useEffect(() => {
		setState(props.area);
	}, [props]);

	const onDelete = name => {
		setState(state.filter(a => a.name !== name));
	};

	const onAdd = () => {
		setState(state.concat(area));
		setArea({ name: '', goal: '' });
	};

	const handleClose = () => {
		props.onClose(state);
	};
	return (
		<Dialog onClose={handleClose} aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">Areas</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={2}>
						<Typography variant="body1">Name:</Typography>
					</Grid>
					<Grid item xs={5}>
						<TextField
							label="Name"
							AutoFocus
							variant="outlined"
							size="small"
							value={area.name}
							onChange={e => {
								setArea({ ...area, name: e.target.value });
							}}
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							label="Goal"
							type="number"
							variant="outlined"
							size="small"
							value={area.goal}
							onChange={e => {
								setArea({ ...area, goal: e.target.value });
							}}
						/>
					</Grid>
					<Grid item xs={2}>
						<IconButton onClick={onAdd} className="text-green">
							<Icon>check</Icon>
						</IconButton>
					</Grid>
				</Grid>
				{(state || []).map((a, index) => (
					<Grid container spacing={2} key={index}>
						<Grid item xs={8}>
							{a.name}
						</Grid>
						<Grid item xs={2}>
							{a.goal}%
						</Grid>
						<Grid item xs={2}>
							<IconButton
								key={a.name}
								onClick={() => {
									onDelete(a.name);
								}}
								className="text-red"
							>
								<Icon>delete</Icon>
							</IconButton>
						</Grid>
					</Grid>
				))}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="secondary" onClick={handleClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function LocalFieldInput(props) {
	const { label } = props;
	return (
		<Grid container spacing={2} style={{ paddingBottom: '10px' }}>
			<Grid item xs={2}>
				{label}
			</Grid>
			<Grid item xs={10}>
				{props.children}
			</Grid>
		</Grid>
	);
}

function AreaImage(props) {
	const { area, format } = props;

	const [images, setImages] = useState([]);

	const getFileMetadata = file => {
		return {
			lastModified: file.lastModified,
			name: file.name,
			size: file.size,
			type: file.type,
			webkitRelativePath: file.webkitRelativePath
		};
	};

	const onFinish = reader => {
		console.log(reader.target.result);
	};

	const handleUpload = async e => {
		let newstate = [];
		for (let i = 0; i < e.target.files.length; i++) {
			const file = e.target.files[i];
			const metadata = getFileMetadata(file);
			const url = URL.createObjectURL(file);
			newstate = [...newstate, { url, metadata, file }];
		}
		setImages(newstate.concat(images));
		area.images = images;
		props.onImageUpdate(area, newstate.concat(images));
	};

	const onDelete = name => {
		console.log(name);
		setImages(
			images.filter(item => item.metadata.name !== name),
			() => {
				props.onImageUpdate(area, images);
			}
		);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={3}>
				{area.name}
			</Grid>
			<Grid item xs={9}>
				<input accept={format} type="file" multiple="multiple" name="AreaImage" onChange={handleUpload} />
			</Grid>
			<Grid item xs={12}>
				<div style={{ display: 'flex' }}>
					{(images || []).map((image, index) => (
						<div key={index} style={{ padding: 10 }}>
							<img alt={image.metadata.name} src={image.url} width="150" height="150" />
							<IconButton onClick={() => onDelete(image.metadata.name)}>
								<Icon>delete</Icon>
							</IconButton>
						</div>
					))}
				</div>
			</Grid>
		</Grid>
	);
}
function NewJob(props) {
	const classes = useStyles();
	const initSetting = [];
	const [settings, setSettings] = useState(initSetting);
	const [est, setEst] = useState(0);
	const [model, setModel] = useState({ airmovers: false, dehumidifier: false, afd: false });
	const [isSame, setIsSame] = useState(true);
	const [newJob, setNewJob] = useState({
		customername: '',
		email: '',
		phonenumber: '',
		category: 'Category1',
		level: 'Class1',
		spJob: true,
		billingcontact: '',
		billingaddressline1: '',
		billingaddressline2: '',
		billingsuburb: '',
		billingstate: 'NSW',
		billingpostcode: '',
		propertycontact: '',
		propertyaddressline1: '',
		propertyaddressline2: '',
		propertysuburb: '',
		propertystate: 'NSW',
		propertypostcode: '',
		dol: new Date(),
		fnol: new Date(),
		areas: [],
		pmhours: 0,
		techhours: 0,
		supervisorhours: 0,
		waterextraction: 0,
		airmovers: 0,
		airmoverdays: 0,
		dehumidifier: 0,
		dehumidifierdays: 0,
		afd: 0,
		afddays: 0,
		estimate: 0
	});
	const [dialog, setDialog] = useState(false);
	const [alert, setAlert] = useState(false);

	useEffect(() => {
		ApiService.getSettings()
			.then(data => {
				setSettings(data.data);
			})
			.then(() => {
				calculateEst();
			});
	}, []);

	useEffect(() => {
		calculateEst();
	}, [
		newJob.pmhours,
		newJob.techhours,
		newJob.supervisorhours,
		newJob.waterextraction,
		newJob.airmover,
		newJob.airmoverdays,
		newJob.dehumidifier,
		newJob.dehumidifierdays,
		newJob.afddays,
		newJob.afd
	]);

	const handleChange = props => event => {
		if (event.target.type === 'checkbox') {
			setNewJob({ ...newJob, [props]: event.target.checked });
		} else {
			const address = [
				'billingaddressline1',
				'billingaddressline2',
				'billingcontact',
				'billingsuburb',
				'billingpostcode',
				'billingstate'
			];
			if (isSame && address.indexOf(props) > -1) {
				copyProperty(props, event.target.value);
			} else {
				setNewJob({ ...newJob, [props]: event.target.value });
			}
		}
	};

	const copyProperty = (prop1, value) => {
		const prop2 = prop1.replace('billing', 'property');
		setNewJob({ ...newJob, [prop1]: value, [prop2]: value });
	};

	const updateAddress = () => {
		setNewJob({
			...newJob,
			propertyaddressline1: newJob.billingaddressline1,
			propertyaddressline2: newJob.billingaddressline2,
			propertycontact: newJob.billingcontact,
			propertysuburb: newJob.billingsuburb,
			propertypostcode: newJob.billingpostcode,
			propertystate: newJob.billingstate
		});
	};

	const handleSameAddress = event => {
		setIsSame(event.target.checked);
		if (event.target.checked) {
			updateAddress();
		} else {
			setNewJob({
				...newJob,
				propertyaddressline1: '',
				propertyaddressline2: '',
				propertycontact: '',
				propertysuburb: '',
				propertypostcode: '',
				propertystate: ''
			});
		}
	};

	const calculateEst = () => {
		const projectManagerPerHour = settings.length === 0 ? 0 : settings[5].value;
		const techPerHour = settings.length === 0 ? 0 : settings[6].value;
		const supervisorPerHours = settings.length === 0 ? 0 : settings[7].value;
		const airMoverPerDay = settings.length === 0 ? 0 : settings[8].value;
		const dehumidifierPerDay = settings.length === 0 ? 0 : settings[9].value;
		const afdPerDay = settings.length === 0 ? 0 : settings[10].value;

		const {
			pmhours,
			techhours,
			supervisorhours,
			airmovers,
			airmoverdays,
			dehumidifier,
			dehumidifierdays,
			afd,
			afddays
		} = newJob;

		const estimate =
			parseFloat(projectManagerPerHour) * pmhours +
			parseFloat(techPerHour) * techhours +
			parseFloat(supervisorPerHours) * supervisorhours +
			parseFloat(airMoverPerDay) * airmovers * airmoverdays +
			parseFloat(dehumidifierPerDay) * dehumidifier * dehumidifierdays +
			parseFloat(afdPerDay) * afd * afddays +
			0;

		setEst(estimate.toFixed(2));
		setNewJob({ ...newJob, estimate: estimate.toFixed(2) });
	};

	const handleDateChange = props => data => {
		setNewJob({ ...newJob, [props]: data });
	};

	const addAreaDialog = () => {
		setDialog(true);
	};

	const onAreaSave = data => {
		setNewJob({ ...newJob, areas: newJob.areas.concat(data) });
		setDialog(false);
	};

	const onAreaClose = () => {
		setDialog(false);
	};

	const formatNumber = num => {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	};

	const removeArea = index => {
		//newJob.areas.splice(index, 1);
		//setNewJob(newJob);
	};

	const closeAlert = () => {
		setAlert(false);
	};

	const saveQuote = () => {
		ApiService.addQuote(newJob).then(data => {
			setAlert(true);
		});
	};

	const onCustomerSelect = customer => {
		console.log(customer);
		setNewJob({ ...newJob, email: customer.billingemail, phonenumber: customer.phonenumber });
	};

	const onEquipmentModelClose = data => {
		console.log(data);
		setModel({ ...model, [data.field]: false });
		setNewJob({ ...newJob, [data.field]: data.state });
	};

	const readFile = (area, file) => {
		const fileReader = new FileReader();

		fileReader.onload = e => {
			area.images.push(e.target.result.replace('data:image/jpeg;base64,', ''));
			const newAreas = newJob.areas.filter(a => a.name !== area.name);
			setNewJob({ ...newJob, areas: newAreas.concat(area) });
		};

		fileReader.readAsDataURL(file);
	};

	const onImageUpload = (area, images) => {
		area['images'] = [];
		for (let i = 0; i < images.length; i++) {
			readFile(area, images[i].file);
		}
	};

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				header: 'min-h-50 h-50 sm:h-80 sm:min-h-80'
			}}
			header={
				<div className="flex flex-1 w-full items-center justify-between">
					<div className="flex flex-col items-start max-w-full">
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Typography
								className="normal-case flex items-center sm:mb-12 text-white"
								component={Link}
								role="button"
								to="/apps/admin/jobs"
								color="inherit"
							>
								<Icon className="text-20">arrow_back</Icon>
							</Typography>
						</FuseAnimate>
						<div className="flex items-center max-w-full">
							<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="text-16 sm:text-20 text-white truncate">
										New Quote
									</Typography>
								</FuseAnimate>
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex=col min-w-50">
							<Typography className="text-20 text-white bg-green p-10 corner-round">
								Estimates: ${formatNumber(est)}
							</Typography>
						</div>
					</div>
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<Button
							className="whitespace-no-wrap normal-case"
							variant="contained"
							color="secondary"
							onClick={saveQuote}
						>
							Save
						</Button>
					</FuseAnimate>
				</div>
			}
			content={
				<Grid container className="p-24" spacing={2}>
					<Grid item xs={12}>
						<FLAlert open={alert} type="success" message="Quote is saved" />
						<EquipmentModel
							label="Air Movers"
							field="airmovers"
							open={model.airmovers}
							count={newJob.airmovers}
							onClose={onEquipmentModelClose}
						/>
						<EquipmentModel
							label="Dehumidifiers"
							field="dehumidifier"
							open={model.dehumidifier}
							count={newJob.dehumidifier}
							onClose={onEquipmentModelClose}
						/>
						<EquipmentModel
							label="AFDs"
							count={newJob.afd}
							field="afd"
							open={model.afd}
							onClose={onEquipmentModelClose} 
						/>
						<AreaModel
							area={newJob.areas}
							open={dialog}
							onClose={areas => {
								setDialog(false);
								setNewJob({ ...newJob, areas: areas });
							}}
						/>
					</Grid>
					<LocalFieldInput label="Job Category:">
						<Category category={newJob.category} />
					</LocalFieldInput>
					<LocalFieldInput label="Job Class:">
						<Class level={newJob.level} />
					</LocalFieldInput>
					<LocalFieldInput label="SP:">
						<Switch
							checked={newJob.spJob}
							onChange={handleChange('spJob')}
							color="primary"
							name="checkedB"
							inputProps={{ 'aria-label': 'SP Job' }}
						/>
					</LocalFieldInput>
					<LocalFieldInput label="Customer:">
						<Grid container>
							<Grid item xs="4">
								<CustomerDropdown onChange={onCustomerSelect} />
							</Grid>
							<Grid item xs="4">
								<TextField
									label="email"
									type="email"
									variant="outlined"
									size="small"
									value={newJob.email}
									onChange={handleChange('email')}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									type="number"
									label="phone"
									variant="outlined"
									size="small"
									value={newJob.phonenumber}
									onChange={handleChange('phonenumber')}
								/>
							</Grid>
						</Grid>
					</LocalFieldInput>
					<LocalFieldInput label="Billing Address:">
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Checkbox value={isSame} checked={isSame} onChange={handleSameAddress} />
								<TextField
									AutoFocus
									label="Billing contact"
									variant="outlined"
									size="small"
									value={newJob.billingcontact}
									onChange={handleChange('billingcontact')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Address line 1"
									variant="outlined"
									size="small"
									value={newJob.billingaddressline1}
									onChange={handleChange('billingaddressline1')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Address line 2"
									variant="outlined"
									size="small"
									value={newJob.billingaddressline2}
									onChange={handleChange('billingaddressline2')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Suburb"
									variant="outlined"
									size="small"
									value={newJob.billingsuburb}
									onChange={handleChange('billingsuburb')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="State"
									variant="outlined"
									size="small"
									value={newJob.billingstate}
									onChange={handleChange('billingstate')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Postcode"
									variant="outlined"
									size="small"
									value={newJob.billingpostcode}
									onChange={handleChange('billingpostcode')}
								/>
							</Grid>
						</Grid>
					</LocalFieldInput>
					<LocalFieldInput label="Property Address:">
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									label="Property Contact"
									variant="outlined"
									size="small"
									value={newJob.propertycontact}
									//onChange={e=>(!isSame ? handleChange('propertycontact', e) : ))}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Address line 1"
									variant="outlined"
									size="small"
									value={newJob.propertyaddressline1}
									onChange={handleChange('propertyaddressline1')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Address line 2"
									variant="outlined"
									size="small"
									value={newJob.propertyaddressline2}
									onChange={handleChange('propertyaddressline2')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Suburb"
									variant="outlined"
									size="small"
									value={newJob.propertysuburb}
									onChange={handleChange('propertysuburb')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="State"
									variant="outlined"
									size="small"
									value={newJob.propertystate}
									onChange={handleChange('propertystate')}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Postcode"
									variant="outlined"
									size="small"
									value={newJob.propertypostcode}
									onChange={handleChange('propertypostcode')}
								/>
							</Grid>
						</Grid>
					</LocalFieldInput>
					<LocalFieldInput label="Date of Loss:">
						<div className={classes.formControl}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									disableToolbar
									autoOk
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="Date of Loss"
									value={newJob.dol}
									onChange={handleDateChange('dol')}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>
					</LocalFieldInput>
					<LocalFieldInput label="First Notice Of Loss:">
						<div className={classes.formControl}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									disableToolbar
									autoOk
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="First Notice of Loss"
									value={newJob.fnol}
									onChange={handleDateChange('fnol')}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>
					</LocalFieldInput>
					<LocalFieldInput label="Areas:">
						<Grid container spacing={2}>
							<Grid item xs={6} lg={2} md={4}>
								<Card>
									<CardHeader className="text-center bg-gray" title="Area" />
									<CardContent className="text-center cursor-pointer" onClick={addAreaDialog}>
										<Typography variant="h5">{newJob.areas.length}</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</LocalFieldInput>
					<LocalFieldInput label="Project Manager Hours:">
						<TextField
							size="small"
							variant="outlined"
							label="Project manager hours"
							value={newJob.pmhours}
							type="number"
							onChange={handleChange('pmhours')}
						/>
					</LocalFieldInput>
					<LocalFieldInput label="Supervisor Hours:">
						<TextField
							size="small"
							variant="outlined"
							label="Supervisor hours"
							value={newJob.supervisorhours}
							type="number"
							onChange={handleChange('supervisorhours')}
						/>
					</LocalFieldInput>
					<LocalFieldInput label="Technician Hours:">
						<TextField
							size="small"
							variant="outlined"
							label="Technician hours"
							value={newJob.techhours}
							type="number"
							onChange={handleChange('techhours')}
						/>
					</LocalFieldInput>
					<LocalFieldInput label="Water extracted:">
						<TextField
							size="small"
							variant="outlined"
							label="Water extrated (in liters)"
							value={newJob.waterextraction}
							type="number"
							onChange={handleChange('waterextraction')}
						/>
					</LocalFieldInput>
					<LocalFieldInput label="Equipments:">
						<Grid container spacing={2}>
							<Grid item lg={3} md={4} xs={4}>
								<Equipment
									name="Air Movers"
									count={newJob.airmovers}
									onClick={() => {
										setModel({ ...model, airmovers: true });
									}}
								/>
								<TextField
									size="small"
									variant="outlined"
									label="# of days for AirMovers"
									value={newJob.airmoverdays}
									type="number"
									onChange={handleChange('airmoverdays')}
								/>
							</Grid>
							<Grid item lg={3} md={4} xs={4}>
								<Equipment
									name="Dehumidifier"
									count={newJob.dehumidifier}
									onClick={() => {
										setModel({ ...model, dehumidifier: true });
									}}
								/>
								<TextField
									size="small"
									variant="outlined"
									label="# of days for Dehumidifier"
									value={newJob.dehumidifierdays}
									type="number"
									onChange={handleChange('dehumidifierdays')}
								/>
							</Grid>
							<Grid item lg={3} md={4} xs={4}>
								<Equipment
									name="AFD"
									count={newJob.afd}
									onClick={() => {
										setModel({ ...model, afd: true });
									}}
								/>
								<TextField
									size="small"
									variant="outlined"
									label="# of days for Afd"
									value={newJob.afddays}
									type="number"
									onChange={handleChange('afddays')}
								/>
							</Grid>
						</Grid>
					</LocalFieldInput>
					<LocalFieldInput label="Images:">
						{newJob.areas.map((a, index) => (
							<AreaImage key={index} area={a} format=".jpg, .jpeg, .png" onImageUpdate={onImageUpload} />
						))}
					</LocalFieldInput>
				</Grid>
			}
			innerScroll
		/>
	);
}
export default NewJob;
