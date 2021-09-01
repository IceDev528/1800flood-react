import axios from 'axios';

export const GET_CUSTOMERS = '[CUSTOMER APP] GET CUSTOMERS';
export const GET_CUSTOMERS_REQUESTS = '[CUSTOMER APP] GET CUSTOMERS REQUESTS';

export function getCustomers(routeParam) {
	const request = axios.get('/api/customer-app/customers', {
		params: routeParam
	});

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_CUSTOMERS,
				payload: [],
				routeParam
			})
		);
}
