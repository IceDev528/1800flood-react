import * as Actions from '../actions';

const initialState = {
	role: [], // guest
	data: {
		firstname: 'Jignesh',
		lastname: 'Jignesh',
		customerid: 0,
		photoURL: 'assets/images/avatars/Velazquez.jpg',
		email: '',
		mobile: '',
		userid: 0,
		shortcuts: [],
	}
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case Actions.SET_USER_DATA: {
			return {
				...initialState,
				...action.payload
			};
		}
		case Actions.REMOVE_USER_DATA: {
			return {
				...initialState
			};
		}
		case Actions.USER_LOGGED_OUT: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};

export default user;
