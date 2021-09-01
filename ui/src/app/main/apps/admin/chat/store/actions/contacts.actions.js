import axios from 'axios';
import ApiService from 'app/services/ApiService';
export const GET_CONTACTS = '[CHAT APP] GET CONTACTS';
export const SET_SELECTED_CONTACT_ID = '[CHAT APP] SET SELECTED CONTACT ID';
export const REMOVE_SELECTED_CONTACT_ID = '[CHAT APP] REMOVE SELECTED CONTACT ID';

export function getContacts() {
	const request = ApiService.getUsers();
	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_CONTACTS,
				payload: response.data
			})
		);
}

export function setselectedContactId(contactId) {
	return {
		type: SET_SELECTED_CONTACT_ID,
		payload: contactId
	};
}

export function removeSelectedContactId() {
	return {
		type: REMOVE_SELECTED_CONTACT_ID
	};
}
