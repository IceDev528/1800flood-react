import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	
	baseurl = 'https://eepx1o9b0k.execute-api.ap-southeast-2.amazonaws.com/prod/';

	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		// axios.interceptors.response.use(
		// 	response => {
		// 		return response;
		// 	},
		// 	err => {
		// 		return new Promise((resolve, reject) => {
		// 			if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
		// 				// if you ever get an unauthorized response, logout the user
		// 				this.emit('onAutoLogout', 'Invalid access_token');
		// 				this.setSession(null);
		// 			}
		// 			throw err;
		// 		});
		// 	}
		// );
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post(`${this.baseurl}register`, data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${this.baseurl}login`, {
					'email': email,
					'password': password
				})
				.then(response => {
					if (response.data) {
						this.setSession(response.data.idToken);
						this.setRefreshToken(response.data.refreshToken);
						const user = {
							data: {
								firstname: response.data.data.firstname,
								lastname: response.data.data.lastname,
								customerid: response.data.data.customerid,
								email: response.data.data.email,
								mobile: response.data.data.mobile,
								isadmin: response.data.data.isadmin,
								userid: response.data.data.userid,
							},
							redirectUrl:
								email === 'jignesh.ahref@outlook.com' ? '/apps/admin/dashboard' : '/apps/client/jobs',
							role: email === 'jignesh.ahref@outlook.com' ? ['admin'] : ['user']
						};
						resolve(user);
					} else {
						reject(response.data.error);
					}
				}).catch(err => {
					reject({ email: email, password: password, error: err.message});
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${this.baseurl}validatetoken`, {
					data: {
						token: this.getAccessToken(),
						refresh: this.getRefreshToken()
					}
				})
				.then(response => {
					if (response.data) {
						this.setSession(response.data.idToken);
						this.setRefreshToken(response.data.refreshToken);
						resolve(response);
					} else {
						this.logout();
						Promise.reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					Promise.reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	setRefreshToken = refresh_token => {
		if (refresh_token) {
			localStorage.setItem('jwt_refresh_token', refresh_token);
		} else {
			localStorage.removeItem('jwt_refresh_token');
		}
	};

	logout = () => {		
		this.setSession(null);
		this.setRefreshToken(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
	
	getRefreshToken = () => {
		return window.localStorage.getItem('jwt_refresh_token');
	};
}

const instance = new JwtService();

export default instance;
