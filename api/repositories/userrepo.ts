import { baserepo } from "./baserepo";
import { ConnectionOptions } from "typeorm";
import { login, register, newPassword, activation, activate } from "../models/models";
import AmazonCognitoIdentity, { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser, CognitoRefreshToken } from  'amazon-cognito-identity-js';
import { ICognitoStorage, ICognitoUserPoolData} from 'amazon-cognito-identity-js';
import awsSdk from 'aws-sdk';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import request from 'request';
import { User } from "../entities/User";
import { Channel } from "../entities/Channel";
import { Customer } from "../entities/Customer";
import AWS from "aws-sdk";

const poolData: ICognitoUserPoolData = {
    UserPoolId: 'ap-southeast-2_y5EyyTFLO',
    ClientId: 'nqh0t5m0i8qcq5its7oa5p36b',
}

const poolRegion = 'ap-southeast-2';

export class userrepo extends baserepo {
    /**
     *
     */
     constructor(config: ConnectionOptions) {
        super(config);

    }

    generateRandomCode(): string {
        return '12345';
    }

    sendSMSWithCode(mobile: string, code: string): void {
        let sns = new AWS.SNS();
        var params = {
            Message: 'Welcome to 1800flood sydney. your auth code is: ' + code,
            MessageStructure: 'string',
            PhoneNumber: mobile
        };
        
        sns.publish(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }

    async insertUser(register: register) {
        let connection = await this.getConnection();

        let customer = new Customer();
        customer.name = register.customer;
        customer = await connection.getRepository(Customer).save(customer);
        let user = new User();
        user.customerid = customer.customerid;
        user.email = register.email;
        user.firstname = register.firstName;
        user.lastname = register.lastName;
        user.mobile = register.mobile;
        user.verificationcode = this.generateRandomCode();
        user = await connection.getRepository(User).save(user);
        // send registration email.
        await this.sendConfirmationEmail(user.email);
        return this.getResponse(200, user);
    }



    async sendConfirmationEmail(email: string) {
        const connection = await this.getConnection();
        const user = await connection.getRepository(User).findOne({email: email});
        if (user) {
            const to = user.email;
            const subject = '1800FLOOD Sydney - Registation';
            const body = `<html><body><p>Hi ${user.firstname} ${user.lastname},</p><p>Thanks for your registration.</p><p>Once your registration is reviewed, We will activate your account and send you activation email.</p><p>Regards,<br/>1800FLOOD Sydney.</p></body></html>`;
            this.sendEmail(to, subject, body);
        }
    }

    async sendActivationEmail(email: string) {
        const connection = await this.getConnection();
        const user = await connection.getRepository(User).findOne({email: email});
        if (user) {
            const to = user.email;
            const subject = '1800FLOOD Sydney - Account activation';
            const body = `<html><body><p>Hi ${user.firstname} ${user.lastname},</p><p>Thanks for registering to our service.</p><p>Your account is activated, you can access your quotes and jobs status on 1800FLOOD sydney.</p><p>Regards,<br/>1800FLOOD Sydney.</p></body></html>`;
            this.sendEmail(to, subject, body);
        }
    }
    // initial registration - 
    async registerUser(register: register) {
        
        return await new Promise<{responsecode: number, body: any}>((resolve, reject) => {
            const userPool = new CognitoUserPool(poolData);
            var attributeList = [];
            attributeList.push(new CognitoUserAttribute({Name:"custom:first_name",Value: register.firstName}));
            attributeList.push(new CognitoUserAttribute({Name:"custom:last_name",Value: register.lastName}));
            attributeList.push(new CognitoUserAttribute({Name:"email",Value: register.email}));
            attributeList.push(new CognitoUserAttribute({Name:"phone_number",Value: register.mobile}));
            attributeList.push(new CognitoUserAttribute({Name:"custom:customer",Value: register.customer}));
            
            userPool.signUp(register.email, register.password, attributeList, null, function(err, result){
                if (err) {
                    console.log(err);
                    return resolve({responsecode: 401, body : { error: err}});
                }
                const cognitoUser = result.user;
                console.log('user name is ' + cognitoUser.getUsername());

                let code = Math.floor(100000 + Math.random() * 900000);
                let sns = new AWS.SNS();
                var params = {
                    Message: 'Welcome to 1800flood sydney. your auth code is: ' + code.toString(),
                    MessageStructure: 'string',
                    PhoneNumber: register.mobile
                };
                
                sns.publish(params, function (err, data) {
                    if (err) console.log(err, err.stack);
                    else console.log(data);
                });
                return resolve({responsecode: 200, body: { data: cognitoUser.getUsername()}});
            });
        });
        
    }

    async getUserDetails(email: string) {
        let connection = this.getConnection();
        let user = (await connection).getRepository(User).findOne({email: email});
        return this.getResponse(200, user);
    }

    async getTokenId(login: login) {
        return new Promise<{success: boolean, tokenId: any, refreshToken: string, err: {}}>((resolve, reject) => {
            let authenticationDetails = new AuthenticationDetails({
                Username : login.email,
                Password : login.password,
            });
            const userPool = new CognitoUserPool(poolData);
            let userData = {
                Username : login.email,
                Pool : userPool
            };
            let cognitoUser = new CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    console.log('access token + ' + result.getAccessToken().getJwtToken());
                    console.log('id token + ' + result.getIdToken().getJwtToken());
                    console.log('refresh token + ' + result.getRefreshToken().getToken());
                    return resolve({success: true, tokenId: result.getIdToken().getJwtToken(), refreshToken: result.getRefreshToken().getToken(), err: ''});
                },
                onFailure: function(err) {
                    console.log(err);
                    return resolve({success: false, tokenId:'', refreshToken: '', err: err});
                },
            });
        });
    }

    async activateUser(userId: string, activateUser: activate) {
        const connection = await this.getConnection();
        let user = await connection.getRepository(User).findOne(userId);
        user.isactive = activateUser.active;
        user.customerid = activateUser.customerid;
        user = await connection.getRepository(User).save(user);
        await this.sendActivationEmail(user.email);
        return this.getResponse(200, user);
    }

    // login
    async login(login: login) {
        const result = await this.getTokenId(login);
        if (result.success) {
            const connection = await this.getConnection();
            const user = await connection.getRepository(User).findOne({email: login.email});
            console.log(user.isactive[0]);
            if (user.isactive[0] === 1) {
                const response = { idToken: result.tokenId, refreshToken: result.refreshToken, data: user, err: ''};
                return this.getResponse(200, response);
            } else {
                const response = { idToken: '', data: '', err: 'Your account is not active, Please wait until your account is activated.'};
                return this.getResponse(401, response);
            }
        } else {
            const response = { idToken: '', data: '', err: result.err};
            return this.getResponse(401, response);
        }
    }

    // update profile
    async updateUserProfile(profile: register) {
        const userPool = new CognitoUserPool(poolData);
        var attributeList = [];
        attributeList.push(new CognitoUserAttribute({
            Name: "first_name",
            Value: profile.firstName
        }));
        attributeList.push(new CognitoUserAttribute({
            Name: "last_name",
            Value: profile.lastName
        }));
        attributeList.push(new CognitoUserAttribute({
            Name: "email",
            Value: profile.email
        }));
        attributeList.push(new CognitoUserAttribute({
            Name: "mobile",
            Value: profile.mobile
        }));
        attributeList.push(new CognitoUserAttribute({
            Name: "mobile",
            Value: profile.mobile
        }));
  
        var authenticationDetails = new AuthenticationDetails({
            Username: profile.email,
            Password: profile.password,
        });

        var userData = {
            Username: profile.email,
            Pool: userPool
        };
        var cognitoUser = new CognitoUser(userData);

        cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
                return this.getResponse(401, 'Error');
            } else {
                console.log(result);
                return this.getResponse(200, '');
            }
        });
    }

    async getKey():Promise<[{alg: string, e: string, kid: string, kty: string, n: string, use: string}]> {
        return new Promise<[{alg: string, e: string, kid: string, kty: string, n: string, use: string}]>((resolve, reject) => {
            request({
                url: `https://cognito-idp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
                json: true
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (!error && response.statusCode === 200) {
                        console.log(response);
                        console.log(body);
                        var keys = body['keys'];
                        resolve(keys);
                    }
                }
            });
        });
    };

    keyVerify(token, pem): Promise<{responsecode: number, body: any}> {
        return new Promise<{responsecode: number, body: any}>((resolve, reject) => {            
            jwt.verify(token, pem, function(err, payload) {
                console.log('err', err);
                console.log('payload', payload);
                if(err) {
                    console.log("Invalid Token.", err);
                    reject({responsecode: 401, body: 'Invalid Token'});
                } else {
                    console.log("Valid Token.");
                    console.log(payload);
                    const data = {
                        email: payload['email'],
                        mobile: payload['phone_number'],
                        firstname: payload['custom:first_name'],
                        lastname: payload['custom:last_name']
                    }
                    resolve({responsecode: 200, body: data});
                }
            });
        })
    }

    async verifyToken(token) {
        const keys = await this.getKey();
        let pems = {};
        
        for(var i = 0; i < keys.length; i++) {
            //Convert each key to PEM
            var key_id = keys[i].kid;
            var modulus = keys[i].n;
            var exponent = keys[i].e;
            var key_type = keys[i].kty;
            var jwk = { kty: key_type, n: modulus, e: exponent};
            var pem = jwkToPem(jwk);
            pems[key_id] = pem;
        }
                    //validate the token
        console.log(token.data.token);
        var decodedJwt = jwt.decode(token.data.token, {complete: true});
        if (!decodedJwt) {
            console.log("Not a valid JWT token");
            return this.getResponse(401, 'Not valid JWT token');
        }
    
        var kid = decodedJwt["header"].kid;
        console.log('kid', kid);
        var pem = pems[kid];
        if (!pem) {
            console.log('Invalid token');
            return this.getResponse(401, 'Invalid token');
        }
    
        const response = await this.keyVerify(token.data.token, pem);
        const connection = await this.getConnection();
        const user = await connection.getRepository(User).findOne({email: response.body.email});
        const newToken = await this.renewToken(user.email, token.data.refresh);
        const output = { ...response, body: {...user, idToken: newToken.id_token, refreshToken: newToken.refresh_token }};
        console.log(output);
        return output;
    }
    
    // update password
    async updatePassword(pass: newPassword) {
        return new Promise<{responsecode: number, body: any}>((resolve, reject)=>{
            var authenticationDetails = new AuthenticationDetails({
                Username: pass.email,
                Password: pass.pass,
            });
    
            const userPool = new CognitoUserPool(poolData);
            var userData = {
                Username: pass.email,
                Pool: userPool
            };
            var cognitoUser = new CognitoUser(userData);
    
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.changePassword(pass.pass, pass.newpass, (err, result) => {
                        if (err) {
                            console.log(err);
                            reject({responsecode: 401, body: err});
                        } else {
                            console.log("Successfully changed password of the user.");
                            console.log(result);
                            resolve({responsecode: 200, body: result});
                        }
                    });
                },
                onFailure: function (err) {
                    console.log(err);
                    reject({responsecode: 401, body: err});
                },
            });
        })
        
    }

    renewToken(email, token) {
        return new Promise<{id_token: string, refresh_token: string}>((resolve, reject) => {
            console.log('refresh token', token);
            const RefreshToken = new CognitoRefreshToken({RefreshToken: token});
    
            const userPool = new CognitoUserPool(poolData);
        
            const userData = {
                Username: email,
                Pool: userPool
            };
            
            
            const cognitoUser = new CognitoUser(userData);
            console.log(cognitoUser);
            console.log(RefreshToken);
            cognitoUser.refreshSession(RefreshToken, (err, session) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    let retObj = {
                        "access_token": session.accessToken.jwtToken,
                        "id_token": session.idToken.jwtToken,
                        "refresh_token": session.refreshToken.token,
                    }
                    console.log(retObj);
                    resolve(retObj);
                }
            })
        });
    }
    // delete user
    deleteUser(user: login) {
        function DeleteUser() {
            var authenticationDetails = new AuthenticationDetails({
                Username: user.email,
                Password: user.password,
            });
    
            var userData = {
                Username: user.email,
                Pool: this.userPool
            };
            var cognitoUser = new CognitoUser(userData);
    
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.deleteUser((err, result) => {
                        if (err) {
                            console.log(err);
                            return this.getResponse(401, { 'err' : err})
                        } else {
                            console.log("Successfully deleted the user.");
                            console.log(result);
                            return this.getResponse(200, 'Success')
                        }
                    });
                },
                onFailure: function (err) {
                    console.log(err);
                },
            });
        }
    }

    async getUsers() {
        let connection = await this.getConnection();
        let users = await connection.getRepository(User).find();
        const result = users.map(u => { return { ...u, avatar: 'assets/images/avatars/profile.jpg', name: u.firstname +' ' + u.lastname } });
        return this.getResponse(200, result);
    }

    async getUserWithChannel(userId, isAdmin) {
        let connection = await this.getConnection();
        let user = await connection.getRepository(User).findOne(userId);
        let channels = [];
        const newuser = { ...user, avatar: 'assets/images/avatars/profile.jpg', name: user.firstname + ' ' + user.lastname};
        if (isAdmin) {
            channels = await connection.getRepository(Channel).find({ admin: user.userid});
        } else {
            channels = await connection.getRepository(Channel).find({ userId: user.userid});
        }
        const result = { user: newuser, channels};
        return this.getResponse(200, result);
    }
}