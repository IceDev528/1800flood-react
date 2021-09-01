import _ from '@lodash';
import * as Actions from '../actions';

const initState = {
	customers: null,
	requests: null,
	selectedRequestIds: [],
	routeParams: [],
	customerDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	}
};

const customersReducer = (state = initState, action) => {
	switch (action.type) {
		case Actions.GET_CUSTOMERS: {
			return {
				...state,
				customers: _.keyBy(action.payload, 'id'),
				routeParams: action.routeParams
			};
		}
		default: {
			return state;
		}
	}
}

export default customersReducer;
