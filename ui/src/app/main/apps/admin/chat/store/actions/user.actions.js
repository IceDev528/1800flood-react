import axios from 'axios';
import ApiService from 'app/services/ApiService';
export const GET_USER_DATA = '[CHAT APP] GET USER DATA';
export const UPDATE_USER_DATA = '[CHAT APP] UPDATE USER DATA';

export function getUserData(state) {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		dispatch({
			type: GET_USER_DATA,
			payload: user
		});
	}
}

export function updateUserData(newData) {
	const request = axios.post('/api/chat/user/data', newData);

	return dispatch =>
		request.then(response =>
			dispatch({
				type: UPDATE_USER_DATA,
				payload: response.data
			})
		);
}
