
import axios from 'axios';
import ApiService from 'app/services/ApiService';

export const GET_CHANNELS = '[CHAT APP] GET CHANNELS';
export const GET_CHANNEL = '[CHAT APP] GET CHANNEL';
export const SEND_CHANNEL_MESSAGE = '[CHAT APP] SEND MESSAGE';

export function getChannels() {
	return (dispatch, getState) => {
		const request = ApiService.getChannels();
		return request.then(response => {
			return dispatch({
				type: GET_CHANNELS,
				channels: response.data
			});
		});
	};
}

export function getChannel(channelId) {
	return (dispatch, getState) => {
		const request = ApiService.getChannel(channelId);
		return request.then(response => {
			return dispatch({
				type: GET_CHANNELS,
				currentChannel: response.data
			});
		});
	};
}

export function sendMessage(messageText, channelId, userId) {
	const message = {
		userId,
		message: messageText,
		channelId
	};
	const request = ApiService.postMessage(channelId, message);

	return dispatch =>
		request.then(response => {
			return dispatch({
				type: SEND_CHANNEL_MESSAGE,
				message: response.data
			});
		});
}
