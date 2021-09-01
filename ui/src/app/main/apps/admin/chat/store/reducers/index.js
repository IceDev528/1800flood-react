import { combineReducers } from 'redux';
import chat from './chat.reducer';
import contacts from './contacts.reducer';
import sidebars from './sidebars.reducer';
import user from './user.reducer';
import channel from './channel.reducer';

const reducer = combineReducers({
	sidebars,
	user,
	contacts,
	chat,
	channel
});

export default reducer;
