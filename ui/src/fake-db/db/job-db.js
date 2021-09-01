import mock from '../mock';
import _ from 'lodash';
const jobs = [
	{
		id: 100000,
		type: 'Category1',
		class: 'Class 1',
		customer: {
			name: 'Judy smith',
			email: 'judy.smith@gmail.com'
		},
		property: {
			address1: '18 Acacia Street',
			address2: '',
			suburb: 'Camden',
			state: 'QLD',
			postcode: '2000'
		},
		billing: {
			address1: '18 Acacia Street',
			address2: '',
			suburb: 'Camden',
			state: 'QLD',
			postcode: '2000'
		},
		jobstatus: 'OPEN',
		jobprogress: 0.8,
		dol: new Date(2020, 2, 2),
		fnol: new Date(2020, 2, 3),
		affectedareas: [
			{
				name: 'Bedroom 1',
				progress: 0.1,
				goal: 0.5
			},
			{
				name: 'Bedroom 2',
				progress: 0.4,
				goal: 0.5
			},
			{
				name: 'Bedroom 3',
				progress: 0.7,
				goal: 0.5
			}
		],
		arrivatedate: new Date(2020, 2, 5),
		departuredate: new Date(2020, 2, 15),
		wrttechs: [
			{
				name: 'Adam Smith',
				mobile: '0433333333'
			},
			{
				name: 'David Baxter',
				mobile: '0433333333'
			},
			{
				name: 'Evan Mobius',
				mobile: '0433333333'
			}
		],
		waterextraction: 10000,
		equipments: [
			{
				type: 'AIRMOVERS',
				area: 'Bedroom 1',
				qty: 5,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'AIRMOVERS',
				area: 'Bedroom 2',
				qty: 3,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'AIRMOVERS',
				area: 'Bedroom 3',
				qty: 2,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'DEHUMIDIFIER',
				area: 'Bedroom 1',
				qty: 5,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'DEHUMIDIFIER',
				area: 'Bedroom 2',
				qty: 3,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'DEHUMIDIFIER',
				area: 'Bedroom 3',
				qty: 2,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'AFD',
				area: 'Bedroom 1',
				qty: 2,
				decomissiondate: new Date(2020, 2, 2)
			}
		],
		paymentmethod: 'Account Based (Set by 1800flood)',
		paymentschedule: [
			{
				stage: 'Stage 20% Complete',
				payment: 0.2
			},
			{
				stage: 'Stage 50% Complete',
				payment: 0.5
			},
			{
				stage: 'Stage 75% Complete',
				payment: 0.75
			},
			{
				stage: 'Stage 100% Complete',
				payment: 1.0
			}
		],
		calloutfees: true,
		calloutfeescharge: 222.28,
		riskassessmentreport: true,
		riskassessmentreportcharge: 176.33,
		waterdamagescopework: true,
		waterdamagescopeworkcharge: 221.95,
		thermographerassessment: true,
		thermographerassessmentcharge: 166.32,
		projectmanagementhours: 10,
		projectmanagementrate: 102.32,
		supervisorhours: 10,
		supervisorrate: 86.23,
		technicianhours: 10,
		technicianrate: 66.92,
		waterextractiontruckmountpetliter: 200,
		waterextractiontruckmountcharge: 3.78,
		antimicrobialtreatmentpersqm: 100,
		antimicrobialtreatmentcharge: 2.78,
		dailydatalogperday: 1,
		dailydatalog: 102.88
	},
	{
		id: 100001,
		type: 'Category1',
		class: 'Class 1',
		customer: {
			name: 'Judy smith',
			email: 'judy.smith@gmail.com'
		},
		property: {
			address1: '18 Acacia Street',
			address2: '',
			suburb: 'Camden',
			state: 'QLD',
			postcode: '2000'
		},
		billing: {
			address1: '18 Acacia Street',
			address2: '',
			suburb: 'Camden',
			state: 'QLD',
			postcode: '2000'
		},
		jobstatus: 'OPEN',
		jobprogress: 0.8,
		dol: new Date(2020, 2, 2),
		fnol: new Date(2020, 2, 3),
		affectedareas: [
			{
				name: 'Bedroom 1',
				progress: 0.1,
				goal: 0.5
			},
			{
				name: 'Bedroom 2',
				progress: 0.4,
				goal: 0.5
			},
			{
				name: 'Bedroom 3',
				progress: 0.7,
				goal: 0.5
			}
		],
		arrivatedate: new Date(2020, 2, 5),
		departuredate: new Date(2020, 2, 15),
		wrttechs: [
			{
				name: 'Adam Smith',
				mobile: '0433333333'
			},
			{
				name: 'David Baxter',
				mobile: '0433333333'
			},
			{
				name: 'Evan Mobius',
				mobile: '0433333333'
			}
		],
		waterextraction: 10000,
		equipments: [
			{
				type: 'AIRMOVERS',
				area: 'Bedroom 1',
				qty: 5,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'AIRMOVERS',
				area: 'Bedroom 2',
				qty: 3,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'AIRMOVERS',
				area: 'Bedroom 3',
				qty: 2,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'DEHUMIDIFIER',
				area: 'Bedroom 1',
				qty: 5,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'DEHUMIDIFIER',
				area: 'Bedroom 2',
				qty: 3,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'DEHUMIDIFIER',
				area: 'Bedroom 3',
				qty: 2,
				decomissiondate: new Date(2020, 2, 2)
			},
			{
				type: 'AFD',
				area: 'Bedroom 1',
				qty: 2,
				decomissiondate: new Date(2020, 2, 2)
			}
		],
		paymentmethod: 'Account Based (Set by 1800flood)',
		paymentschedule: [
			{
				stage: 'Stage 20% Complete',
				payment: 0.2
			},
			{
				stage: 'Stage 50% Complete',
				payment: 0.5
			},
			{
				stage: 'Stage 75% Complete',
				payment: 0.75
			},
			{
				stage: 'Stage 100% Complete',
				payment: 1.0
			}
		],
		calloutfees: true,
		calloutfeescharge: 222.28,
		riskassessmentreport: true,
		riskassessmentreportcharge: 176.33,
		waterdamagescopework: true,
		waterdamagescopeworkcharge: 221.95,
		thermographerassessment: true,
		thermographerassessmentcharge: 166.32,
		projectmanagementhours: 10,
		projectmanagementrate: 102.32,
		supervisorhours: 10,
		supervisorrate: 86.23,
		technicianhours: 10,
		technicianrate: 66.92,
		waterextractiontruckmountpetliter: 200,
		waterextractiontruckmountcharge: 3.78,
		antimicrobialtreatmentpersqm: 100,
		antimicrobialtreatmentcharge: 2.78,
		dailydatalogperday: 1,
		dailydatalog: 102.88
	}
];

mock.onGet('/api/jobs').reply(() => {
	return [200, jobs];
});

mock.onGet('/api/jobs/');
