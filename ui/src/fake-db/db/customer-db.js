import axios from 'axios';
import _ from '@lodash';
import mock from '../mock';

const customers = [
	{
		id: 1,
		name: 'Mirvac Building',
		abn: '1212121',
		email: 'john',
		address: {
			address1: '80 George st',
			address2: ''
		},
		users: [{}]
	}
];

mock.onGet('./api/customerApp/customers').reply(config=>{
    return [200, customers];
});
