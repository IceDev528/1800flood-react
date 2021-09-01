export interface newjob {
    jobid: number | undefined,
    jobnumber: number,
    jobstatus: string,
    issp: boolean,
    customerid: number,
    status: string,
    billing: {
        address1: string,
        address2: string,
        suburb: string,
        state: string,
        postcode: string,
    },
    property: {
        address1: string,
        address2: string,
        suburb: string,
        state: string,
        postcode: string,
    },
    category: string,
    level: string,
    dol: Date,
    fnol: Date,
    areas: Array<area>,
    arrivaldate: Date,
    departuredate: Date | undefined,
    technicians: Array<technician>,
    waterextraction: number,
    paymentschedules: Array<paymentschedule>,
    paymentmethodid: number,
    billitems: Array<billitem>,
}

export interface sendQuote {
    email: string
}

export interface newQuote {
    issp: boolean,
    status: string,
    customername: string,
    email: string,
    phonenumber: string,
    customerid: string,
    billingcontact: string
    billingaddressline1: string,
    billingaddressline2: string,
    billingsuburb: string,
    billingstate: string,
    billingpostcode: string,
    propertycontact: string,
    propertyaddressline1: string,
    propertyaddressline2: string,
    propertysuburb: string,
    propertystate: string,
    propertypostcode: string,
    category: string,
    level: string,
    dol: Date,
    fnol: Date,
    areas: Array<area>,
    arrivaldate: Date,
    departuredate: Date | undefined,
    numberOfTech: string,
    pmhours: number,
    techhours: number,
    supervisorhours: number,
    airmovers: number,
    airmoverdays: number,
    dehumidifier: number,
    waterextracted: number,
    dehumidifierdays: number,
    afd: number,
    afddays: number,
    estimate: string,
}

export interface billitem {
    billitemid: number | undefined,
    name: string,
    amount: string,
    qty: number,
    order: number
}

export interface paymentschedule {
    paymentscheduleid: number | undefined
    progress: number,
    order: number,
    amount: number,
    datereceived: Date,
    paymentref: string
}

export interface technician {
    technicianid: number | undefined,
    name: string,
    mobile: string,
};

export interface area {
    areaid: number | undefined,
    name: string,
    airmovers: number,
    dehumidifier: number,
    afd: number,
    decomissiondate: Date,
    goal: number,
    progress: number,
    images: []
};

export interface user {
    firstname: string,
    lastname: string,
    mobile: string,
    email: string,
    activationcode: string,
    password: string,
}

export interface QueryOption {
    limit: number;
    offset: number;
    filter: string;
    orderby: string; // 
    module: string; // ie. accc,
    search: string;
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    DEL = "DELETE",
    PUT = "PUT",
    OPTIONS = "OPTIONS",
}

export interface setting {
    settingid: string,
    name: string,
    value: string
}

export interface login {
    email: string,
    password: string,
}

export interface register {
    email: string,
    firstName: string,
    lastName: string,
    mobile: string,
    customer: string,
    password: string,
}

export interface newPassword {
    email: string,
    pass: string,
    newpass: string,
}

export interface activation {
    email: string,
    activationCode: string
}

export interface address {
    addressid: number,
    addressline1: string,
    addressline2: string,
    suburb: string,
    state: string,
    postcode: string,
    contact: string
}

export interface customer {
    name: string,
    billingemail: string,
    phonenumber: string,
}

export interface activate {
    customerid: number,
    active: boolean
}