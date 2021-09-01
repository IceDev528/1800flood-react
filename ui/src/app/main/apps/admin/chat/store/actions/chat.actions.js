import axios from 'axios';
import ApiService from 'app/services/ApiService';
import { setselectedContactId } from './contacts.actions';
import { closeMobileChatsSidebar } from './sidebars.actions';

export const GET_CHAT = '[CHAT APP] GET CHAT';
export const REMOVE_CHAT = '[CHAT APP] REMOVE CHAT';
export const SEND_MESSAGE = '[CHAT APP] SEND MESSAGE';

export function getChat(contactId) {
	return (dispatch, getState) => {
		const request = ApiService.getChannel(contactId);
		return request.then(response => {
			dispatch(setselectedContactId(response.userid));

			dispatch(closeMobileChatsSidebar());

			return dispatch({
				type: GET_CHAT,
				chatList: response.data.messages,
				userChatData: []
			});
		});
	};
}

export function removeChat() {
	return {
		type: REMOVE_CHAT
	};
}

export function sendMessage(messageText, channelId, userId) {
	const message = {
		userId,
		message: messageText,
		channelId
	};

	// const request = axios.post('/api/chat/send-message', {
	// 	chatId,
	// 	message
	// });
	const request = ApiService.postMessage(channelId, message);

	return dispatch =>
		request.then(response => {
			return dispatch({
				type: SEND_MESSAGE,
				message: response.data,
				userChatData: response.data.userChatData
			});
		});
}
