import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageCarded from '@fuse/core/FusePageCarded';
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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GaugeChart from 'react-gauge-chart';
import ApiService from 'app/services/ApiService';
import Address from 'app/main/common/Address';
import Area from 'app/main/common/Area';
import JobStatus from 'app/main/common/JobStatus';
import JobType from 'app/main/common/JobType';
import BillItem from 'app/main/common/BillItem';
import Technician from 'app/main/common/Technician';
import DateField from 'app/main/common/DateField';
import Class from 'app/main/common/Class';
import Category from 'app/main/common/Category';
import Customer from 'app/main/common/Customer';

const useStyles = makeStyles(theme => ({}));


function AreaImages(props) {
	const { area } = props;
	const [state, setState] = useState([]);

	useEffect(() => {
		ApiService.getAreaImages(area.jobid, area.areaid).then(result => {
			setState(result.data);
		});
	}, [props]);

	return (
		<div style={{ display: 'flex' }}>
			{(state || []).map(image => (
				<div style={{ padding: 10, display: 'inline' }}>
					<img
						onClick={() => {
							window.open(image.location, '_blank');
						}}
						src={image.location}
						width={200}
						height={200}
					/>
				</div>
			))}
		</div>
	);
}

function ClientAddress(props) {
	const { address } = props;
	return (
		<div>
			<Grid container>
				<Grid item xs={12}>
					{address.addressline1}
				</Grid>
				<Grid item xs={12}>
					{address.addressline2}
				</Grid>
				<Grid item xs={12}>
					{address.suburb}
				</Grid>
				<Grid item xs={12}>
					{address.state} - {address.postcode}
				</Grid>
				<Grid item xs={12}>
					Contact: {address.contact}
				</Grid>
			</Grid>
		</div>
	);
}

function ClientArea(props) {
	const { area } = props;
	return (
		<div>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Grid container>
						<Grid item xs={4}>
							<Typography variant="subtitle2">{area.name}</Typography>
							<GaugeChart
								id={'row-p-' + area.areaid}
								percent={parseFloat(area.progress /100)}
								nrOfLevels={10}
								arcsWidth={0.5}
								cornerRadius={5}
								colors={['#FF5F6D', '#FFC371', '#009923']}
								style={{width: '150px'}}
								textColor="black"
								needleColor="gray"
							/>
						</Grid>
						<Grid item xs={8} className="text-center">
							<AreaImages area={area} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

function ClientPhoto(props) {
	const { photo } = props;
	return (
		<div>
			<image alt="Area photo" scr={photo.url} width={200} height={200} />
		</div>
	);
}

function ClientDate(props) {
	const { date } = props;
	return <div>{moment(date).format("DD/MM/YYYY")}</div>;
}

function Job(props) {

	const initState = {
		jobid: 0,
		jobnumber: 0,
		category: '',
		jobstatus: '',
		jobtype: '',
		class: '',
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
				airmovers: 10,
				dehumidifer: 10,
				afd: 10,
				decomissiondate: '2020-03-25T01:45:49.000Z'
			}
		],
		technicians: [],
		billItems: [],
		jobprogress: [],
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
		}
	};
	const { jobId } = useParams();
	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState(0);
	const [job, setJob] = useState(initState);
	const { productId } = props;

	const chartStyle = {
		width: '200px'
	};

	useEffect(() => {
		ApiService.getJob(jobId)
			.then(response => {
				setJob(response.data);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-120 h-80 sm:h-120 sm:min-h-120'
			}}
			header={
				<div className="flex flex-1 w-full items-center justify-between">
					<div className="flex flex-col items-start max-w-full">
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Typography
								className="normal-case flex items-center sm:mb-12"
								component={Link}
								role="button"
								to="/apps/client/jobs"
								color="inherit"
							>
								<Icon className="text-20">arrow_back</Icon>
								<span className="mx-4">Jobs</span>
							</Typography>
						</FuseAnimate>
						<div className="flex items-center max-w-full">
							<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="text-16 sm:text-20 truncate">Job ID : {job.jobid}</Typography>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography variant="caption">Job Details</Typography>
								</FuseAnimate>
							</div>
						</div>
					</div>
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<Button className="whitespace-no-wrap normal-case" variant="contained" color="secondary">
							Contact Support
						</Button>
					</FuseAnimate>
				</div>
			}
			content={
				<div className="p-16 sm:p-24 max-w-2xl">
					<Grid container spacing={2}>
						<Grid item xs={4}>
							<div className="mb-20">
								<Typography variant="subtitle" className="font-bold font-16">
									Job ID : {job.jobid}
								</Typography>
							</div>
							<div className="mb-20">
								<Typography variant="subtitle" className="font-bold font-16">
									SP Job?:
									<Switch
										checked={job.issp}
										value="issp"
										color="primary"
										inputProps={{ 'aria-label': 'primary checkbox' }}
									/>
								</Typography>
							</div>
							<div className="mb-20">
								<Typography variant="subtitle" className="font-bold font-16">
									Estimated Quote:
								</Typography>
								<Typography variant="body1" className="font-18">
									${job.estimate}
								</Typography>
							</div>
						</Grid>
						<Grid item xs={8}>
							<Grid container>
								<Grid item xs={6}>
									<div className="mb-20">
										<Typography variant="subtitle" className="font-bold font-16">
											Billing Address:
										</Typography>
										<ClientAddress address={job.billingaddress}/>
									</div>
								</Grid>
								<Grid item xs={6}>
									<div className="mb-20">
										<Typography variant="subtitle" className="font-bold font-16">
											Property Address:
										</Typography>
										<ClientAddress address={job.propertyaddress}/>
									</div>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container>
								<Grid item xs={2}>
									CATEGORY:
								</Grid>
								<Grid item xs={4}>
									<Typography variant="subtitle">{job.category}</Typography>
								</Grid>
								<Grid item xs={2}>
									CLASS:
								</Grid>
								<Grid item xs={4}>
									<Typography variant="subtitle">{job.class}</Typography>
								</Grid>
								<Grid item xs={2}>
									TYPE:
								</Grid>
								<Grid item xs={4}>
									<Typography variant="subtitle">{job.jobtype}</Typography>
								</Grid>
								<Grid item xs={2}>
									STATUS:
								</Grid>
								<Grid>
									<Typography variant="subtitle">{job.jobstatus}</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<Typography className="font-14">D.O.L:</Typography>
								</Grid>
								<Grid item xs={4}>
									<ClientDate date={job.dateOfLoss} />
								</Grid>
								<Grid item xs={2}>
									<Typography className="font-14">F.N.O.L:</Typography>
								</Grid>
								<Grid item xs={4}>
									<ClientDate date={job.firstNoticeOfLoss} />
								</Grid>

								<Grid item xs={2}>
									<Typography className="font-14">Arrival Date:</Typography>
								</Grid>
								<Grid item xs={4}>
									<ClientDate date={job.arrivaldatetime} />
								</Grid>

								<Grid item xs={2}>
									<Typography className="font-14">Departure Date:</Typography>
								</Grid>
								<Grid item xs={4}>
									<ClientDate date={job.departuredatetime} />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<Typography className="font-14">Affected areas:</Typography>
								</Grid>
								<Grid item xs={10}>
									{(job.areas || []).map(item => (
										<ClientArea area={item} />
									))}
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
											<div>
												<div>{item.name}</div>
												<div>{item.mobile}</div>
											</div>
										))}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<Typography variant="body1">Psychometrics:</Typography>
								</Grid>
								<Grid item xs={10}>
									<table border={1} cellPadding={3} cellSpacing={3}>
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
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			}
			innerScroll
		/>
	);
}

export default Job;
