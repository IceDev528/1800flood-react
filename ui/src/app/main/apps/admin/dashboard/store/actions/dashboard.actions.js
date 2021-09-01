import axios from 'axios';

export const GET_DASHBOARD = '[DASHBOARD] GET DATA';

export function getDashboard() {
	const request = axios.get('/api/dashboard-app/dashboard');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_DASHBOARD,
				payload: response.data
			})
		);
}
