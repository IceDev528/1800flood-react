import * as Actions from '../actions';

const initState = null;

const dashboardReducer = (state = initState, action) => {
	switch (action.type) {
		case Actions.GET_DASHBOARD:
			return [...action.payload];
		default:
			return initState;
	}
};

export default dashboardReducer;
