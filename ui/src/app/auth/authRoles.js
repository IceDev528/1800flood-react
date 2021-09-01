/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['admin'],
	staff: ['admin', 'staff'],
	user: ['staff', 'user'],
	onlyGuest: []
};

export default authRoles;
