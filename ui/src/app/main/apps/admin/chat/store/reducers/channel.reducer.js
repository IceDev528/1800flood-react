import * as Actions from '../actions';

const initialState = {
	channels: [],
	selectedChannelId: 0,
	channel: {
		messages: []
	}
};

const channels = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_CHANNELS: {
			return {
				...state,
				channels: action.channels
			};
		}
		case Actions.GET_CHANNEL: {
			return {
				...state,
				channel: action.channel
			};
		}
		case Actions.SEND_CHANNEL_MESSAGE: {
			return {
				...state,
				channel: { ...state.channel, messages: [...state.channels.messages, action] }
			};
		}
		default: {
			return state;
		}
	}
};

export default channels;
