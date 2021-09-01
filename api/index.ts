const globalAny:any = global;
import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import { ResponseBuilder } from './responsebuilder';
import { register, login, newPassword, area, newjob, technician, paymentschedule, billitem, setting, newQuote } from "./models/models";
import AWS from 'aws-sdk';
import { ICognitoUserPoolData, CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";
import fs from 'fs';
let isprod = false;
let ConnectionOptions : ConnectionOptions;
let isdebug = false;
globalAny.fetch = require('node-fetch');

if (process.env.isprod === undefined) {
    ConnectionOptions = {
        "name": "default",
        "type": "mysql",
        "host": 'database-1.cluster-chubz9r2eboh.ap-southeast-2.rds.amazonaws.com',
        "port": 3306,
        "username": 'root',
        "password": 'Wonderwomen8910',
        "database": 'flood1800',
        "synchronize": false,
        "debug": true,
        "entities": [
            "./build/entities/*.js"
        ],
        "migrations": [
            "./build/migration/*.js"
        ],
        "subscribers": [
            "./build/subscriber/*.js"
        ],
        "cli": {
        "entitiesDir": "entities",
        "migrationsDir": "migration",
        "subscribersDir": "subscriber"
        }
    };
} else {
    isprod = process.env.isprod == "true" ? true : false;
    ConnectionOptions = {
        "name": "default",
        "type": "mysql",
        "host": process.env.host,
        "port": 3306,
        "username": process.env.username,
        "password": process.env.password,
        "database": process.env.dbname,
        "synchronize": false,
        "debug": process.env.isdebug === "true" ? true : false,
        "entities": [
            "entities/*.js"
        ],
        "migrations": [
            "migration/*.js"
        ],
        "subscribers": [
            "subscriber/*.js"
        ],
        "cli": {
            "entitiesDir": "entities",
            "migrationsDir": "migration",
            "subscribersDir": "subscriber"
        }
        };
 }

exports.handler = async (event:any) => {

    console.log(event);
    if (isdebug) {
        console.log(event);
    }

    let method = event.httpMethod;
    let resource = event.requestContext.resourcePath; 
    let queryString = event.queryStringParameters;
    let pathParameters = event.pathParameters;
    let body:any = {};
    
    if (event.body !== undefined
            && event.body !== ''
            && event.requestContext.resourcePath !== '/jobs/{id}/uploadpdf'
            && event.requestContext.resourcePath !== '/jobs/{id}/areas/{areaid}/images') {
        body = JSON.parse(event.body);
    }

    if (event.requestContext.resourcePath === '/jobs/{id}/uploadpdf' ||
        event.requestContext.resourcePath === '/jobs/{id}/areas/{areaid}/images') {
        console.log(event.body);
        body = event.body;
    }
    
    const responseBuilder = new ResponseBuilder(ConnectionOptions, 
        method, 
        resource, 
        queryString, 
        pathParameters,  
        body);

    var result = await responseBuilder.getResponse();

    if (isdebug) {
        console.log(result);
    }

    let response = {
        "statusCode": result.responsecode,
        "body": JSON.stringify(result.body),
        "isBase64Encoded": false,
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials' : true,
            'Content-Type': 'application/json',
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS,HEAD",
        }
    };

    return response;
};

if (!isprod) {
    // console.log("== get jobs ==")
    let register: register = {
        email: 'uipathsyd@outlook.com',
        customer: 'test',
        firstName: 'test',
        lastName: 'patel',
        password: 'Password123456',
        mobile: '+610433958420',
    }

    let login: login = {
        email: 'jignesh.ahref@outlook.com',
        password: 'Password123456',
    }

    let reset: newPassword = {
        email: 'jignesh.ahref@hotmail.com',
        pass: 'Password123456',
        newpass: 'NewPassword12345',
    }

    let newjob: newjob = {
        jobid: undefined,
        jobnumber: 20001,
        jobstatus: 'OPEN',
        issp: true,
        customerid: 1,
        status: 'OPEN',
        billing: {
            address1: '80 George st',
            address2: '',
            suburb: 'Sydney',
            state: 'NSW',
            postcode: '2000',
        },
        property: {
            address1: '80 George st',
            address2: '',
            suburb: 'Sydney',
            state: 'NSW',
            postcode: '2000',
        },
        category: 'Category 1',
        level: 'Level 1',
        dol: new Date(2020, 2, 10),
        fnol: new Date(2020, 2, 11),
        areas: [
            {
                areaid: undefined,
                name: 'Bedroom',
                goal: .50,
                progress: 0.0,
                airmovers: 10,
                dehumidifier: 10,
                afd: 10,
                decomissiondate: new Date(2020, 2, 20),
                images: []
            }
        ],
        arrivaldate: new Date(2020, 2, 10),
        departuredate: new Date(2020, 2, 20),
        technicians: [
            {
                technicianid: undefined,
                name: 'Andrew Martin',
                mobile: '121212121'
            }
        ],
        waterextraction: 120000,
        paymentschedules: [
            {
                paymentscheduleid: undefined,
                progress: .25,
                order: 1,
                amount: 0,
                paymentref: '',
                datereceived: new Date()
            },
            {
                paymentscheduleid: undefined,
                progress: .50,
                order: 2,
                amount: 0,
                paymentref: '',
                datereceived: new Date()
            },
            {
                paymentscheduleid: undefined,
                progress: .75,
                order: 3,
                amount: 0,
                paymentref: '',
                datereceived: new Date()
            },
            {
                paymentscheduleid: undefined,
                progress: 1.0,
                order: 4,
                amount: 0,
                paymentref: '',
                datereceived: new Date()
            },
        ],
        paymentmethodid: 1,
        billitems: [
            {
                billitemid: undefined,
                name: 'Call out fees',
                qty: 1,
                amount: "222.00",
                order: 1,
            }
        ]
    }

    let newquote: newQuote = {
        issp: true,
        status: 'QUOTE',
        customerid: "0",
        customername: 'jignesh',
        email: 'test@gmail.com',
        phonenumber: '0433958420',
        billingcontact: 'jig',
        billingaddressline1: '80 pitt st',
        billingaddressline2: '',
        billingsuburb: 'sydney',
        billingstate: 'nsw',
        billingpostcode: '2000',
        propertycontact: 'andy',
        propertyaddressline1: '90 Clearane st',
        propertyaddressline2: '',
        propertysuburb: 'parramatta',
        propertystate: 'nsw',
        propertypostcode: '2000',
        category: 'Category1',
        level: 'Calss 1',
        dol: new Date(2020, 2, 2),
        fnol: new Date(2020, 2, 2),
        areas: [],
        arrivaldate: new Date(2020, 2, 2),
        departuredate: undefined,
        numberOfTech: "2",
        pmhours: 2,
        waterextracted: 100,
        techhours: 2,
        supervisorhours: 2,
        airmovers: 10,
        airmoverdays: 20,
        dehumidifier: 20,
        dehumidifierdays: 20,
        afd: 20,
        afddays: 20,
        estimate: "0",
    };

    let settings: setting =
    {
        settingid:"1",
        name: 'test',
        value: '20'
    };


    // exports.handler({
    //     "httpMethod": "POST",
    //     "requestContext": {                         
    //         "resourcePath": "/jobs"
    //     },
    //     "queryStringParameters": {
    //     }, 
    //     "pathParameters": {
    //     },
    //     "body" : JSON.stringify(newjob)
    // }).then((data)=>{
    //     console.log(data);
    // });

    let area: area = {
        name: 'Bedroom',
        airmovers: 10,
        afd: 10,
        areaid: undefined,
        decomissiondate: new Date(2020, 2, 24),
        dehumidifier: 10,
        goal: .4,
        progress: .0,
        images: []
    }

    let tech: technician = {
        name: 'Andrew Martin',
        mobile: '0433999999',
        technicianid: undefined,
    }

    let paymentprogress: paymentschedule = {
        progress: .25,
        paymentscheduleid: undefined,
        order: 1,
        amount: 0,
        paymentref: '',
        datereceived: new Date()
    }

    let billitem: billitem = {
        billitemid: undefined,
        amount: "200",
        qty: 1,
        name: 'Call out fees',
        order: 1
    }

    let updatearea = {"areaid":31,"jobid":20,"goal":"0.40","progress":"0.50","name":"Bedroom","airmovers":6,"dehumidifier":6,"afd":6,"decomissiondate":"2020-04-11T13:34:23.000Z","airmover":"4"};

    const token = 'eyJraWQiOiIwSVZIUldVMmNSSHRjb2g4YW9cL3pEeE1oZG01aXh2UjhuaEhTb0JuR3VIdz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhYTg3ZGMxMy1mYjA1LTQ0ZjctYmEyYS1kOTRhNGZhNTc1MGMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmN1c3RvbWVyIjoiUmF5d2hpdGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfeTVFeXlURkxPIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6ImppZ25lc2guYWhyZWZAb3V0bG9vay5jb20iLCJhdWQiOiJucWgwdDVtMGk4cWNxNWl0czdvYTVwMzZiIiwiY3VzdG9tOmxhc3RfbmFtZSI6IlBhdGVsIiwiZXZlbnRfaWQiOiI5OGQ1ZmU5Ni1iOTg1LTRmMzItYWUwZS00YzJiZDJkMWQ0M2EiLCJjdXN0b206Zmlyc3RfbmFtZSI6ImppZ25lc2giLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4NjU4ODAwMSwicGhvbmVfbnVtYmVyIjoiKzYxMDQzMzk1ODQyMCIsImV4cCI6MTU4NjU5MTYwMSwiaWF0IjoxNTg2NTg4MDAxLCJlbWFpbCI6ImppZ25lc2guYWhyZWZAb3V0bG9vay5jb20ifQ.Y-xbYaVgtghWiJSLozBagAyyTOw1HNEWjoCHJysi5SG3Bp9E8b3RvwoLeDtl4ZFWTeV40DrRJ43HK9cyzXeSbSNKis78PtOvUeiy-VXHntJYRw5M3ylar4dcsSE1Q2DKz4plixGh-TQKhcoZXoQeYFNsE_1w7VL7SMpW2xM1WdmOySatpRyOoC7VWtkMbMFk9D-uGrGppitZPBxSYB0hZehUzO0GBbkT3PTk9QlvX4i92l3icqvSFzIXskFCg62QPLakZiijYB_v7qkq78io-lkUPS1gFtS5kgLq5oDMSwOdmLOrwcGmkUVG20PBuuJvd0Kla6XSzbtPlJeiaJ_8zA';
    const refresh = 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.fIXQi8ct2ihYzbVByOdxp785nrsmo8ZqpqShrBMPE77K1g4RzJqfhMPIeZtvnesI7LkWc9BWoXOLBeIjpiwbSAfcA61X1WHbrgMMxWuYJI0WauIf8JZQrVoUVhCBmfkY0lm0MF-a8GunUZVVWKqo2cpaWiDaMWqbJ9D5JWBke0VT5IGFJm7DV8s9p4FgDRjtXOan3tVhVIA8nsMlLyyqq8IcRnqti4pHpLQ07wRrkh36OZZZIc1ag9_UTW7KtjuL1DOblKDg6oXfZerdb1nNbW2LhVJ0Nt48ruNF2Ay_aww_aCjIDFoTqGVIIUb8oXNpmUvVgFHryO5H6na40sQXig.4IRqP1vC1ZznOXqA.eSZ-EMcKE3p1YWsW0SSwqTp8KUEjM6QXXTBTa7Zhk5KGiOtjUQ5FBT4g_Ekzi1Ngr1-vJem7gZsNkromcuPlL9p3LFqSJyZaHSG3E674aR8ncRmX5qQW6xeSrES__mDGOl1KTh-8vmU5sW38L934VGanjOqfL8fl8AFo8olMk-Qo_HJ1m-eitEDLUNnQV-xMmKN8_cj-Njt2mDiyypSGxI3KLoOut3JlahdlLhUeI11-wp7uIVZINJGtxXOKgRPmprzxGmlIB1YoqrI3DZTjXkiEg9CfKUVX-GvUM58MaPZRwSj26sEQMUY_RPAO_8Xu2QaUsxAtVjBEF7C_wPQfVhSK6lEJJk6ryDpDYHF5eTripxcrPm_LAxPh32qUZ3RFnIfXQA34gxvVk0IKkE6DhL7GNH8tVZg0_-H9XRblp6C9S57ftZ01Xhz9p_w84petzfpDo0IiIenqnKcWqxWL4AqoBt-bDHrT8thMva5KIGexS6WRGboNvMzvMqw50mVFBJmDaHdoJtUX5AiMu56rWjqvlG1qpDcjXEi1SD4LLz8KBC3WVAscEkx5MCDA5QM4vFkFytnDbsnUCyiBf5DJKUrOhhon1M6UMgsPBCyVLM-JTf2ds-j7o1llGCGEL0kLvAUSxwmLQv1dS0_2EIvCywCFqwsosq45Y5f_IDEG77T-RsQ56xKM32-_Av5VkbIHhwvgqLbKUP1s4xZ-Ibgs5nlOdie-kQvWL_WlCn0uk6p_sqzWDT6ddv0G3W_hHYti2xGPvFouZyRpGo9LQCTYKenDzbBujGT6xnfx5E-3rZ3RxcpGmpqNdOBN5qlsHTr8p1fIoayNEbN2CuvBRPyTSnklLaHIJnnQqzCrjmvpTh0GiyMQ5KMupzkn5cFMJVR-s2YvoLHar8pdM0Pl9ZlmRrqj-olHZTCx4p6ua4p_yr21BZM3gVdDlZwCD13GHPZRUiEWHDFzpwolA0sr28nDXK2xuPf51MbLFOES8879tB7yt6OkMvfTsR_FuMugOjE6JOIZGDnTbzRN-cPuPehOW7zAjZwXaHLs4mu2uX-uB_o8S-KuQuqJwJROQzmdb9GdAu_Ximm126xtZXLu-EEANMTttzDYKc61Z7hXpYeu8oUmikrxjKjidO8Zz9aAvmVrdqqWgpgwUtUuhUY3wUJSRcjUF2V-Io6gZEZdlVZsD785zU-yOHpqTKDiSmVKhmywBDWBRpcQM9sfC3pbnmf1ltufN30kYA2znGqw9bCyMy5_eON_Wj5lE80ZDXFfVPpJuvYiFuWK7NC2sL_4gRhIP-QpJ1xWq1hM4uk1HzTeSGwRgoeoU1I7Ldg.bt7pUAK2kaHCY-jc_x7rDA';

    const buff = fs.readFileSync('sample.pdf');

    const channel = {
        name: 'L j Hooker',
        admin: 6,
        userid: 11
    };

    const message = {
        channelid: 2,
        message: "hellow",
        admin: 6,
        userid: 11
    };
    exports.handler({
        "httpMethod": "GET",
        "requestContext": {
            "resourcePath": "/jobs/stats"
        },
        "queryStringParameters": {
        }, 
        "pathParameters": {
           "id": 2
        },
        "body" : JSON.stringify('')
    }).then((data)=>{
        console.log(data);
    });

    // const poolData: ICognitoUserPoolData = {
    //     UserPoolId: 'ap-southeast-2_y5EyyTFLO',
    //     ClientId: 'nqh0t5m0i8qcq5its7oa5p36b',
    // }
    // AWS.config.region = 'ap-eastsouth-2';
    // const userPool = new CognitoUserPool(poolData);
    // var attributeList = [];
    // attributeList.push(new CognitoUserAttribute({Name:"custom:first_name",Value: register.firstName}));
    // attributeList.push(new CognitoUserAttribute({Name:"custom:last_name",Value: register.lastName}));
    // attributeList.push(new CognitoUserAttribute({Name:"email",Value: register.email}));
    // attributeList.push(new CognitoUserAttribute({Name:"phone_number",Value: register.mobile}));
    // attributeList.push(new CognitoUserAttribute({Name:"custom:customer",Value: register.customer}));

    // userPool.signUp(register.email, register.password, attributeList, null, function(err, result){
    // if (err) {
    //     console.log(err);
    //     return err;
    // }
    // const cognitoUser = result.user;
    // console.log('user name is ' + cognitoUser.getUsername());

    // // insert data in table

    //     return cognitoUser.getUsername();
    // });
}