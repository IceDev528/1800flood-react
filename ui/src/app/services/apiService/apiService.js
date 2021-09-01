import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

class ApiService extends FuseUtils.EventEmitter {
	baseurl = 'https://eepx1o9b0k.execute-api.ap-southeast-2.amazonaws.com/prod/';
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
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

	registerUser = data => {
		return new Promise((resolve, reject) => {
			axios.post(`${this.baseurl}register`, data).then(response => {
				if (response.data) {
					resolve(response.data);
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
					email: email,
					password: password
				})
				.then(response => {
					console.log(response);
					if (response.data.idToken) {
						this.setSession(response.data.idToken);
						resolve(response.data.idToken);
					} else {
						reject(response.data.error);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get('/api/auth/access-token', {
					data: {
						access_token: this.getAccessToken()
					}
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
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

	uploadPdf = (jobId, file) => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${this.baseurl}jobs/${jobId}/uploadpdf`, file)
				.then(result => {
					resolve(result);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(new Error('Failed to upload the pdf file'));
				});
		});
	};

	setSession = accessToken => {
		if (accessToken) {
			localStorage.setItem('jwt_access_token', accessToken);
			axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = accessToken => {
		if (!accessToken) {
			return false;
		}
		const decoded = jwtDecode(accessToken);
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

	getCustomerJobs = id => {
		return this.getData(`${this.baseurl}customers/${id}/jobs`);
	};

	getJobs = () => {
		return this.getData(`${this.baseurl}jobs`);
	};

	getSettings() {
		return this.getData(`${this.baseurl}settings`);
	}

	getJob = id => {
		return this.getData(`${this.baseurl}jobs/${id}`);
	};

	addQuote = newjob => {
		return this.postData(`${this.baseurl}quotes`, newjob);
	};

	convertQuoteToJob = jobid => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `quote/${jobid}/convert`, { data: jobid })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to convert job from quote to job'));
				});
		});
	};

	sendQuoteToCustomer = (jobid, email) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `quote/${jobid}/send`, { email })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to send quote to customer.'));
				});
		});
	};

	updateJob = job => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `jobs/${job.jobid}`, job)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to save job.'));
				});
		});
	};

	updateAddress = address => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `addresses/${address.addressid}/`, address)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to save address.'));
				});
		});
	};

	updateTechnician = technician => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${technician.jobid}/technicians/${technician.technicianid}`, technician)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to save technician.'));
				});
		});
	};

	updateArea = (jobId, area) => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${jobId}/areas/${area.areaid}`, area)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to save area.'));
				});
		});
	};

	updateBillItem = billItem => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${billItem.jobid}/billitems/${billItem.billitemid}`, billItem)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to save area.'));
				});
		});
	};

	updateSetting = setting => {
		return this.putData(`${this.baseurl}settings/${setting.settingid}`, setting);
	};

	sendQuote = (jobId, emaillist) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `quotes/${jobId}/sendquote`, emaillist)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to deliver mail'));
				});
		});
	};

	addJob = newjob => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `jobs`, { data: newjob })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new job'));
				});
		});
	};

	addJobArea = (area, id) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `jobs/${id}/areas`, area)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new area'));
				});
		});
	};

	addJobProgress = (progress, id) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `jobs/${id}/billschedule`, progress)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new job progress'));
				});
		});
	};

	addJobTechnician = (tech, id) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `jobs/${id}/technicians`, tech)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new technician'));
				});
		});
	};

	delJobArea = (area, id) => {
		return new Promise((resolve, reject) => {
			axios
				.delete(this.baseurl + `jobs/${id}/areas/${area.areaid}`, { data: area })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to delete area'));
				});
		});
	};

	delJobProgress = (progress, id) => {
		return new Promise((resolve, reject) => {
			axios
				.delete(this.baseurl + `jobs/${id}/billschedule/${progress.jobprogressid}`, { data: progress })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new job progress'));
				});
		});
	};

	delJobTechnician = (tech, id) => {
		return new Promise((resolve, reject) => {
			axios
				.delete(`${this.baseurl}jobs/${id}/technicians/${tech.wrttechid}`, { data: tech })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to delete technician'));
				});
		});
	};

	deleteSetting = id => {
		return this.deleteData(`${this.baseurl}settings/${id}`, { id });
	};

	updateSetting = setting => {
		return this.putData(`${this.baseurl}settings/${setting.settingid}`, setting);
	};

	saveJobArea = (area, id) => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${id}/areas/${area.areaid}`, { data: area })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new area'));
				});
		});
	};

	saveJobProgress = (progress, id) => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${id}/jobprogress/${progress.progressid}`, { data: progress })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new job progress'));
				});
		});
	};

	saveJobTechnician = (tech, id) => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${id}/technicians/${tech.technicianid}`, { data: tech })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Promise.reject(new Error('Unable to create new technician'));
				});
		});
	};

	saveSettings = settings => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + 'settings/1', settings)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	updateJobProgress = (progress, id) => {
		return this.putData(`${this.baseurl}jobs/${id}/billschedule/${progress.jobprogressid}`, progress);
	};

	updateJobBillItem = (billitem, id) => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${id}/billitems/${billitem.billitemid}`, { data: billitem })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	removeJobArea = (jobid, areaid) => {
		return new Promise((resolve, reject) => {
			axios
				.delete(this.baseurl + `jobs/${jobid}/areas/${areaid}`)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	removeTechnician = id => {
		return new Promise((resolve, reject) => {
			axios
				.delete(this.baseurl + `jobs/${id}`)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	updateField = (jobid, field, value) => {
		return new Promise((resolve, reject) => {
			axios
				.put(this.baseurl + `jobs/${jobid}/field`, { name: field, value: value })
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	getCustomers = () => {
		return new Promise((resolve, reject) => {
			axios
				.get(this.baseurl + `customers`)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	getUsers = () => {
		return new Promise((resolve, reject) => {
			axios
				.get(this.baseurl + `users`)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	activateUser = (userId, body) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `users/${userId}/activate`, body)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	addCustomer = (customer: any) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `customers`, customer)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	addSetting = (setting: any) => {
		return new Promise((resolve, reject) => {
			axios
				.post(this.baseurl + `settings`, setting)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	removeSetting = settingid => {
		return new Promise((resolve, reject) => {
			axios
				.delete(this.baseurl + `settings/${settingid}`)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(err);
				});
		});
	};

	addImages = (jobId, images) => {
		return this.postData(`${this.baseurl}jobs/${jobId}/images`, images);
	};

	removeImage = (jobId, imageId) => {
		return this.deleteData(`${this.baseurl}jobs/${jobId}/images/${imageId}`, {});
	};

	getJobBills = jobid => {
		return this.getData(`${this.baseurl}jobs/${jobid}/bills`);
	};

	getData = url => {
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then(response => {
					resolve(response);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(new Error('Unable to get data' + url));
				});
		});
	};

	postData = (url, data) => {
		return new Promise((resolve, reject) => {
			axios
				.post(url, data)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(new Error('Unable to post data'));
				});
		});
	};

	deleteData = (url, data) => {
		return new Promise((resolve, reject) => {
			axios
				.delete(url, data)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(new Error('Unable to delete data'));
				});
		});
	};

	putData = (url, data) => {
		return new Promise((resolve, reject) => {
			axios
				.put(url, data)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					console.log(err);
					Promise.reject(new Error('Unable to update data'));
				});
		});
	};

	getJobProgress = jobId => {
		return this.getData(`${this.baseurl}jobs/${jobId}/progress`);
	};

	getAreaImages = (jobId, areaId) => {
		return this.getData(`${this.baseurl}jobs/${jobId}/areas/${areaId}/images`);
	};

	deleteImage = (jobId, imageId) => {
		return this.deleteData(`${this.baseurl}jobs/${jobId}/images/${imageId}`);
	};

	getChannels = () => {
		return this.getData(`${this.baseurl}channels`);
	};

	getChannel = channelId => {
		return this.getData(`${this.baseurl}channels/${channelId}`);
	};

	getChannelByUser = (userId, contactId) => {
		return this.getData(`${this.baseurl}channels/`, { userId, contactId });
	};

	getPsychometrics = (jobId, areaId) => {
		return this.getData(`${this.baseurl}jobs/${jobId}/areas/${areaId}/psychometrics`);
	};

	updatePsychometric = (jobId, areaId, psychometricId, data) => {
		return this.putData(`${this.baseurl}/jobs/${jobId}/areas/${areaId}/psychometrics/${psychometricId}`, data);
	};

	postMessage = (channelId, message) => {
		return this.postData(`${this.baseurl}channels/${channelId}/messages`, message);
	};

	getStats = () => {
		return this.getData(`${this.baseurl}jobs/stats`);
	};

	getUserWithChannel = userId => {
		return this.postData(`${this.baseurl}users/${userId}/channels`, {
			isAdmin: true
		});
	};

	formatCurrency = number => {
		const formatter = new Intl.NumberFormat('en-AU', {
			style: 'currency',
			currency: 'AUD',
			minimumFractionDigits: 2
		});
		return formatter.format(number);
	};

}

const instance = new ApiService();

export default instance;
