import moment from 'moment';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import * as FuseActions from 'app/store/actions/fuse';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ApiService from 'app/services/ApiService';
import Address from 'app/main/common/Address';
import Area from 'app/main/common/Area';
import JobStatus from 'app/main/common/JobStatus';
import JobType from 'app/main/common/JobType';
import BillItem from 'app/main/common/BillItem';
import Technician from 'app/main/common/Technician';
import DateField from 'app/main/common/DateField';
import EditField from 'app/main/common/EditField';
import Class from 'app/main/common/Class';
import Category from 'app/main/common/Category';
import Customer from 'app/main/common/Customer';
import AddAreaModel from './AddAreaModel';
import AddTechnicianModel from './AddTechnicianModel';
import Equipment from './Equipment';
import EquipmentModel from './EquipmentModel';
import UploadPdf from './UploadPdf';
import AreaModel from './AreaModel';
import BillScheduleModel from './BillScheduleModel';
import AreaProgressModel from './AreaProgressModel';
import PsychometricModel from './PsychometricModel';
import { AreaImages } from './AreaImages';

const useStyles = makeStyles(theme => ({
	paperWidthSm: {
		minWidth: 500,
		maxWidth: 600
	}
}));

function JobField(props) {
	const { title } = props;
	return (
		<Grid item xs={12}>
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<Typography variant="body1">{title}</Typography>
				</Grid>
				<Grid item xs={10}>
					{props.children}
				</Grid>
			</Grid>
		</Grid>
	);
}

function Job(props) {
	const classes = useStyles();

	const initjob = {
		jobid: 0,
		jobnumber: 0,
		category: '',
		jobstatus: '',
		jobtype: '',
		class: '',
		estimate: '0.0',
		progress: '0.00',
		isSp: true,
		dateOfLoss: '',
		firstNoticeOfLoss: '',
		arrivaldatetime: '',
		departuredatetime: '',
		waterextracted: 0,
		paymentmethodid: 1,
		customerid: 7,
		areas: [
			{
				areaid: 9,
				jobid: 8,
				goal: '0.00',
				progress: '0.00',
				name: null,
				airmovers: 0,
				dehumidifer: 0,
				afd: 0,
				decomissiondate: '2020-03-25T01:45:49.000Z'
			}
		],
		technicians: [],
		billItems: [],
		billschedule: [
			{
				datereceived: new Date(),
				paymentref: '',
				jobprogress: 0,
				amount: 0
			}
		],
		psychometrics: [
			{
				psychometricid: 0,
				areaid: 0,
				name: '',
				day1: 0,
				day2: 0,
				day3: 0,
				day4: 0,
				day5: 0,
				day7: 0,
				day8: 0,
				day9: 0,
				day10: 0,
				day11: 0
			}
		],
		billingaddress: {
			addressid: 16,
			addressline1: '',
			addressline2: '',
			suburb: '',
			state: '',
			postcode: ''
		},
		propertyaddress: {
			addressid: 17,
			addressline1: '',
			addressline2: '',
			suburb: '',
			state: '',
			postcode: ''
		},
		customer: {
			customerid: 0,
			name: '',
			billingemail: '',
			phonenumber: ''
		},
		billschedule: [
			{
				jobprogressid: 0,
				progress: 0,
				datereceived: new Date(),
				paymentref: '',
				amount: 0
			}
		]
	};

	const [tabValue, setTabValue] = useState(0);
	const { jobId } = useParams();
	const [job, setJob] = useState(initjob);
	const [dialog, setDialog] = useState(false);
	const [tDialog, setTDialog] = useState(false);
	const [eDialog, setEdialog] = useState(false);
	const [aDialog, setAdialog] = useState(false);
	const [pDialog, setPDialog] = useState(false);
	const [bDialog, setBDialog] = useState(false);
	const [yDialog, setYDialog] = useState(false);
	const [mDialog, setMDialog] = useState(false);
	const [estEmailList, setEstEmailList] = useState(job.customer.billingemail);
	const dispatch = useDispatch();
	const { showMessage } = props;

	const header = document.getElementById('#job-header');

	const onScroll = e => {
		console.log(e);
		if (window.pageYOffset > 150) {
			header.addClass('fix-header');
		} else {
			header.removeClass('fix-header');
		}
	};

	useEffect(() => {
		ApiService.getJob(jobId)
			.then(data => {
				console.log(data.data);
				setJob(data.data);
				setEstEmailList(data.data.customer.billingemail);
			})
			.catch(err => {
				// re-direct to error page.
			});

		window.addEventListener('scroll', onScroll);
	}, []);

	if (!job) {
		return <Redirect to="/error" />;
	}
	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	const updateField = (field, value) => {
		ApiService.updateField(jobId, field, value)
			.then(data => {
				console.log(data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const handleChange = props => event => {
		if (event.target.type === 'checkbox') {
			setJob({ ...job, [props]: event.target.checked });
		} else {
			setJob({ ...job, [props]: event.target.value });
		}

		const array = [
			'isSp',
			'dateOfLoss',
			'firstNoticeOfLoss',
			'arrivaldatetime',
			'departuredatetime',
			'waterextracted'
		];
		if (array.indexOf(props) > -1) {
			let field = '';
			if (props === 'dateOfLoss') {
				field = 'DOL';
			}
			if (props === 'firstNoticeOfLoss') {
				field = 'FNOL';
			}
			if (props === 'departuredatetime') {
				field = 'DEPARTUREDATE';
			}
			if (props === 'arrivaldatetime') {
				field = 'ARRIVALDATE';
			}
			if (props === 'waterextracted') {
				field = 'WATEREXTRACTED';
			}
			if (props === 'isSp') {
				field = 'ISSP';
			}
			if (field !== '') {
				updateField(field, event.target.value);
			}
		}
	};

	const addArea = () => {
		setDialog(true);
	};
	
	const onAreaClose = list => {
		setAdialog(false);
		setJob({ ...job, areas: list });
		//updatePsychometrics(list);
	};

	const onAreaProgressClose = list => {
		setPDialog(false);
		setJob({ ...job, areas: list });
	};

	const addTechnician = () => {
		setTDialog(true);
	};

	const onTechnicianSave = tech => {
		setTDialog(false);
		if (tech) {
			ApiService.addJobTechnician(tech, jobId)
				.then(data => {
					setJob({ ...job, technicians: job.technicians.concat(data.data) });
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	const onTechnicianClose = () => {
		setTDialog(false);
	};

	// const onAreaDelete = (area: any) => {
	// 	ApiService.delJobArea(area, jobId).then(data => {
	// 		setJob({ ...job, areas: job.areas.filter(a => a.areaid !== area.areaid) });
	// 	});
	// };

	const onTechDelete = (tech: any) => {
		ApiService.delJobTechnician(tech, jobId).then(data => {
			setJob({ ...job, technicians: job.technicians.filter(a => a.wrttechid !== tech.wrttechid) });
		});
	};

	const onBillItemChange = billItem => {
		ApiService.updateBillItem(billItem)
			.then(data => {
				this.props.showMessage({ message: 'Bill Item updated' });
			})
			.catch(err => {
				//props.onError();
			});
	};

	const onAreaClick = () => {
		setAdialog(true);
	};

	const sendEstimates = () => {
		ApiService.sendQuote(jobId, { emaillist: estEmailList })
			.then(data => {
				dispatch(
					MessageActions.showMessage({
						message: 'Estimate is send to customer.', //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'center' //left center right
						},
						variant: 'success'
					})
				);
				setMDialog(false);
			})
			.catch(err => {
				dispatch(
					MessageActions.showMessage({
						message: 'Error occured while sending email', //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'center' //left center right
						},
						variant: 'danger'
					})
				);
			});
	};

	const onSendQuote = () => {
		setMDialog(true);
	};

	const onEquipmentClick = () => {
		setEdialog(true);
	};

	const calcAirMovers = areas => {
		if (Array.isArray(areas) && areas.length > 0) {
			return areas
				.map(c => c.airmovers)
				.reduce((p, c) => {
					return p + c;
				});
		}
		return 0;
	};

	const calcDehumidifer = areas => {
		if (Array.isArray(areas) && areas.length > 0) {
			return areas
				.map(c => c.dehumidifier)
				.reduce((p, c) => {
					return p + c;
				});
		}
		return 0;
	};

	const calcADF = areas => {
		if (Array.isArray(areas) && areas.length > 0) {
			return areas
				.map(c => c.afd)
				.reduce((p, c) => {
					return p + c;
				});
		}
		return 0;
	};

	const onCustomerUpdate = cust => {
		console.log(cust);
		ApiService.updateField(jobId, 'CUSTOMERID', cust.customerid).then(data => {
			dispatch(
				MessageActions.showMessage({
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'center' //left center right
					},
					variant: 'success',
					message: 'Customer updated'
				})
			);
		});
	};

	const onEquipmentClose = () => {};

	const onAreaDialogClose = () => {};

	const onCustomerAdd = customer => {
		ApiService.addCustomer(customer).then(data => {});
	};

	const calculateJobPrice = () => {
		// get counts
		const days = moment(job.departuredatetime)
			.diff(moment(job.arrivaldatetime))
			.format('DD');
		const totalAirMovers = job.areas
			.map(a => a.airmovers)
			.reduce((p, c) => {
				return p + c;
			});
		const totalDee = job.areas
			.map(a => a.dehumidifier)
			.reduce((p, c) => {
				return p + c;
			});
		const totalAfd = job.areas
			.map(a => a.afd)
			.reduce((p, c) => {
				return p + c;
			});
	};

	const onEquipmentDialogClose = areas => {
		setEdialog(false);
		setJob({ ...job, areas: areas });
	};

	const onAreaDelete = list => {
		setJob({ ...job, areas: list });
	};

	const onBillScheduleClose = list => {
		setBDialog(false);
		list.map(b => {
			ApiService.updateJobProgress(b, jobId);
		});
		setJob({ ...job, billschedule: list });
	};

	const onBillScheduleDelete = list => {
		setJob({ ...job, billschedule: list });
	};

	const jobProgress = () => {
		const progress = job.areas.map(a => a.progress).reduce((a, b) => a + b, 0);
		const overall = progress / (job.areas.length === 0 ? 1 : job.areas.length);
		return overall;
	};

	const onPsychometricClose = list => {
		setYDialog(false);
		list.map(a => {
			ApiService.updatePsychometric(jobId, a.areaid, a.psychometricid, a);
		});
		setJob({ ...job, psychometrics: list });
	};

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-50 h-50 sm:h-80 sm:min-h-80'
			}}
			header={
				<div className="flex flex-1 w-full items-center justify-between">
					<div className="flex flex-col items-start max-w-full">
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Typography
								className="normal-case flex items-center sm:mb-12"
								component={Link}
								role="button"
								to="/apps/admin/jobs"
								color="inherit"
							>
								<Icon className="text-20">arrow_back</Icon>
								<span className="mx-4">Jobs</span>
							</Typography>
						</FuseAnimate>
					</div>
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<div>
							<Button
								className="whitespace-no-wrap normal-case pl-10"
								variant="contained"
								color="secondary"
								onClick={onSendQuote}
							>
								Send Estimates
							</Button>
						</div>
					</FuseAnimate>
				</div>
			}
			content={
				<div className="p-16 sm:p-24 max-w-2xl">
					<Dialog open={mDialog}>
						<DialogTitle>Send Estimates</DialogTitle>
						<DialogContent>
							<Grid container spacing={2} style={{ width: 500 }}>
								<Grid item xs={2}>
									Emails:
								</Grid>
								<Grid item xs={8}>
									<TextField
										style={{ width: 350 }}
										size="small"
										variant="outlined"
										onChange={e => {
											setEstEmailList(e.target.value);
										}}
										label="Emails (seperated by ;)"
										value={estEmailList}
									/>
								</Grid>
							</Grid>
						</DialogContent>
						<DialogActions>
							<Button onClick={sendEstimates} variant="contained" color="primary">
								Send Estimates
							</Button>
							<Button onClick={() => setMDialog(false)} variant="contained" color="secondary">
								Cancel
							</Button>
						</DialogActions>
					</Dialog>
					<Grid container spacing={2}>
						<Grid item xs={12} id="job-header">
							<Grid container>
								<Grid item xs={4}>
									<div className="mb-20">
										<Typography variant="subtitle" className="font-bold font-16">
											Job ID : {job.jobid + 30000}
										</Typography>
									</div>
									<div className="mb-20">
										<Typography variant="subtitle" className="font-bold font-16">
											SP Job?:
											<Switch
												checked={job.isSp}
												value={job.isSp}
												color="primary"
												onChange={handleChange('isSp')}
												inputProps={{ 'aria-label': 'primary checkbox' }}
											/>
										</Typography>
									</div>
									<div className="mb-20">
										<Typography variant="subtitle" className="font-bold font-16">
											Estimated Quote:
										</Typography>
										<Typography variant="body1" className="font-18">
											{ApiService.formatCurrency(job.estimate)}
										</Typography>
									</div>
								</Grid>
								<Grid item xs={8}>
									<Customer
										customer={job.customer}
										onUpdate={onCustomerUpdate}
										onCustomerAdd={onCustomerAdd}
									/>
									<Grid container>
										<Grid item xs={6}>
											<div className="mb-20">
												<Typography variant="subtitle" className="font-bold font-16">
													Billing Address:
												</Typography>
												<Address address={job.billingaddress} editable="true" />
											</div>
										</Grid>
										<Grid item xs={6}>
											<div className="mb-20">
												<Typography variant="subtitle" className="font-bold font-16">
													Property Address:
												</Typography>
												<Address address={job.propertyaddress} editable="true" />
											</div>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12}>
							<Grid container>
								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Category:</Typography>
								</Grid>
								<Grid item xs={10}>
									<Category
										jobId={jobId}
										category={job.category}
										handleChange={handleChange('category')}
									/>
								</Grid>
								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Class:</Typography>
								</Grid>
								<Grid item xs={10}>
									<Class jobId={jobId} level={job.class} handleChange={handleChange('class')} />
								</Grid>
								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Type:</Typography>
								</Grid>
								<Grid item xs={10}>
									<JobType jobId={jobId} type={job.jobtype} handleChange={handleChange('type')} />
								</Grid>
								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Status:</Typography>
								</Grid>
								<Grid item xs={10}>
									<JobStatus
										jobId={jobId}
										status={job.jobstatus}
										handleChange={handleChange('status')}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">D.O.L:</Typography>
								</Grid>
								<Grid item xs={10}>
									<DateField value={job.dateOfLoss} handleChange={handleChange('dateOfLoss')} />
								</Grid>
								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">F.N.O.L:</Typography>
								</Grid>
								<Grid item xs={10}>
									<DateField
										value={job.firstNoticeOfLoss}
										handleChange={handleChange('firstNoticeOfLoss')}
									/>
								</Grid>

								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Arrival Date:</Typography>
								</Grid>
								<Grid item xs={10}>
									<DateField
										value={job.arrivaldatetime}
										handleChange={handleChange('arrivaldatetime')}
									/>
								</Grid>

								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Departure Date:</Typography>
								</Grid>
								<Grid item xs={10}>
									<DateField
										value={job.departuredatetime}
										handleChange={handleChange('departuredatetime')}
									/>
								</Grid>

								<Grid item xs={2} className="pt-5">
									<Typography className="font-14">Water Extracted (in liters):</Typography>
								</Grid>
								<Grid item xs={10}>
									<EditField
										value={job.waterextracted}
										handleChange={handleChange('waterextracted')}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<AreaModel
										jobId={jobId}
										areas={job.areas}
										onDelete={onAreaDelete}
										onClose={onAreaClose}
										open={aDialog}
									/>
									<Typography className="font-14">Affected areas:</Typography>
								</Grid>
								<Grid item xs={10}>
									<Grid container>
										<Equipment
											name="Affected areas"
											areas={job.areas}
											onClick={onAreaClick}
											count={job.areas.length}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<Typography className="font-14">Equipments: </Typography>
								</Grid>
								<Grid item xs={10}>
									<Grid container spacing={2}>
										<EquipmentModel
											jobId={jobId}
											open={eDialog}
											onClose={onEquipmentDialogClose}
											areas={job.areas}
										/>
										<Grid item xs={4}>
											<Equipment
												name="Air Movers"
												onClick={onEquipmentClick}
												areas={job.areas}
												count={calcAirMovers(job.areas)}
											/>
										</Grid>
										<Grid item xs={4}>
											<Equipment
												name="Dehumidifier"
												onClick={onEquipmentClick}
												areas={job.areas}
												count={calcDehumidifer(job.areas)}
											/>
										</Grid>
										<Grid item xs={4}>
											<Equipment
												name="AFD"
												onClick={onEquipmentClick}
												areas={job.areas}
												count={calcADF(job.areas)}
											/>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<Typography variant="body1">Technicians:</Typography>
								</Grid>
								<Grid item xs={10}>
									<Grid container>
										{(job.technicians || []).map(item => (
											<Technician key={item.wrttechid} tech={item} onDelete={onTechDelete} />
										))}
										<Grid item xs={2}>
											<div>
												<AddTechnicianModel
													open={tDialog}
													onSave={onTechnicianSave}
													onClose={onTechnicianClose}
													jobid={jobId}
												/>
												<IconButton onClick={addTechnician} className="text-green">
													<Icon>add</Icon>
												</IconButton>
											</div>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<Typography variant="body1">Images:</Typography>
								</Grid>
								<Grid item xs={10}>
									<Grid container>
										<Grid item xs={2}>
											<div>
												{(job.areas || []).map(area => (
													<AreaImages area={area} jobId={jobId} />
												))}
											</div>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<JobField title="Job Progress:">
							<AreaProgressModel
								areas={job.areas}
								jobId={jobId}
								open={pDialog}
								onClose={onAreaProgressClose}
							/>
							<div className="flex" onClick={() => setPDialog(true)}>
								{(job.areas || []).map((area, index) => (
									<div key={index} className="m-10">
										<div>{area.name}</div>
										<div>{area.progress}%</div>
									</div>
								))}
							</div>
						</JobField>
						<JobField title="Billing Schedule:">
							<BillScheduleModel
								jobId={jobId}
								open={bDialog}
								onDelete={onBillScheduleDelete}
								onClose={onBillScheduleClose}
								schedule={job.billschedule}
							/>
							{job.billschedule.length > 0 ? (
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Date Received</TableCell>
											<TableCell>Payment Ref.</TableCell>
											<TableCell>Progress</TableCell>
											<TableCell>Amount</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(job.billschedule || []).map((schedule, index) => (
											<TableRow>
												<TableCell>
													{moment(schedule.datereceived).format('DD/MM/YYYY')}
												</TableCell>
												<TableCell>{schedule.paymentref}</TableCell>
												<TableCell>{schedule.progress}%</TableCell>
												<TableCell>{ApiService.formatCurrency(schedule.amount)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div />
							)}
							<IconButton onClick={() => setBDialog(true)}>
								<Icon>add</Icon>
							</IconButton>
						</JobField>
						<JobField title="Psychometric Reading:">
							<PsychometricModel
								open={yDialog}
								areas={job.areas}
								psychometrics={job.psychometrics}
								onClose={onPsychometricClose}
							/>
							<table border={1} onClick={() => setYDialog(true)} cellPadding={3} cellSpacing={3}>
								<thead>
									<tr>
										<td>Area Name</td>
										<td>Day 1</td>
										<td>Day 2</td>
										<td>Day 3</td>
										<td>Day 4</td>
										<td>Day 5</td>
										<td>Day 6</td>
										<td>Day 7</td>
										<td>Day 8</td>
										<td>Day 9</td>
										<td>Day 10</td>
										<td>Day 11</td>
									</tr>
								</thead>
								<tbody>
									{(job.psychometrics || []).map((psy, index) => (
										<tr key={index}>
											<td>{psy.name}</td>
											<td>{psy.day1}%</td>
											<td>{psy.day2}%</td>
											<td>{psy.day3}%</td>
											<td>{psy.day4}%</td>
											<td>{psy.day5}%</td>
											<td>{psy.day6}%</td>
											<td>{psy.day7}%</td>
											<td>{psy.day8}%</td>
											<td>{psy.day9}%</td>
											<td>{psy.day10}%</td>
											<td>{psy.day11}%</td>
										</tr>
									))}
								</tbody>
							</table>
						</JobField>
						<JobField title="Bill Items:">
							{(job.billItems || []).map((item, index) => (
								<BillItem key={index} item={item} handleChange={onBillItemChange} />
							))}
						</JobField>
					</Grid>
				</div>
			}
		/>
	);
}

export default Job;
