import { ConnectionOptions } from "typeorm";
import { newjob, area, technician, billitem, paymentschedule, setting, newQuote, sendQuote, address } from "../models/models";
import { baserepo } from "./baserepo";
import { Job } from "../entities/Job";
import { Address } from "../entities/Address";
import { Area } from "../entities/Area";
import { Billitem } from "../entities/Billitem";
import { Jobprogress } from "../entities/Jobprogress";
import { Wrttech } from "../entities/Wrttech";
import { Settings } from "../entities/Settings";
import { Customer } from "../entities/Customer";
import { Image } from "../entities/Image";
import moment from 'moment';
import AWS from 'aws-sdk';
import { PutObjectRequest, GetObjectRequest } from "aws-sdk/clients/s3";
import { Bill } from "../entities/Bill";
import path from 'path';
import { Psychometric } from "../entities/Psychometric";

export class jobrepo extends baserepo {
    region: string = 'ap-southeast-2';
    constructor(connection: ConnectionOptions) {
        super(connection);
        this.connectionOption = connection;
    }

    connectionOption: ConnectionOptions;

    async getAddresses(params) {
        let connection = await this.getConnection();
        let addresses = await connection.getRepository(Address).createQueryBuilder("aa").getMany();
        return this.getResponse(200, addresses);
    }

    async getAddress(id) {
        let connection = await this.getConnection();
        let address = await connection.getRepository(Address).findOne(id);
        return this.getResponse(200, address);
    }

    async addQuote(quote: newQuote) {
        let connection = await this.getConnection();
        
        let billingaddress = new Address();
        billingaddress.contact = quote.billingcontact;
        billingaddress.addressline1 = quote.billingaddressline1;
        billingaddress.addressline2 = quote.billingaddressline2;
        billingaddress.suburb = quote.billingsuburb;
        billingaddress.state = quote.billingstate;
        billingaddress.postcode = quote.billingpostcode;
        billingaddress = await connection.getRepository(Address).save(billingaddress);
        
        let propertyaddress = new Address();
        propertyaddress.contact = quote.propertycontact;
        propertyaddress.addressline1 = quote.propertyaddressline1;
        propertyaddress.addressline2 = quote.propertyaddressline2;
        propertyaddress.suburb = quote.propertysuburb;
        propertyaddress.state = quote.propertystate;
        propertyaddress.postcode = quote.propertypostcode;
        propertyaddress = await connection.getRepository(Address).save(propertyaddress);

        let customer = new Customer();
        if (quote.customerid == "0") {
            customer.name = quote.customername;
            customer.billingemail = quote.email;
            customer.phonenumber = quote.phonenumber;
            customer.billingaddressid = billingaddress.addressid;
            customer = await connection.getRepository(Customer).save(customer);
        } else {
            customer = await connection.getRepository(Customer).findOne(quote.customerid);
        }

        let newjob = new Job();
        newjob.billingaddressid = billingaddress.addressid;
        newjob.propertyaddressid = propertyaddress.addressid;
        newjob.customerid = customer.customerid;
        
        newjob.jobtype = 'QUOTE';
        newjob.dateOfLoss = quote.dol;
        newjob.firstNoticeOfLoss = quote.fnol;
        newjob.category = quote.category;
        newjob.class = quote.level;
        newjob.isSp = quote.issp;
        newjob.jobstatus = 'OPEN';
        newjob.paymentmethodid = 1;
        newjob.estimate = quote.estimate;
        newjob.waterextracted = quote.waterextracted;
        newjob.pmhours = quote.pmhours;
        newjob.techhours = quote.techhours;
        newjob.supervisorhours = quote.supervisorhours;
        newjob = await connection.getRepository(Job).save(newjob);
        
        for(let i = 0; i < quote.areas.length; i++) {
            let newArea = quote.areas[i];
            let area = new Area();
            area.jobid = newjob.jobid;
            area.name = newArea.name;
            area.goal = newArea.goal;
            //area.decomissiondate = newArea.decomissiondate;
            area.airmovers = quote.airmovers;
            area.dehumidifier = quote.dehumidifier;
            area.afd = quote.afd;
            area = await connection.getRepository(Area).save(area);

            if (newArea.images.length > 0) {
                for(let j = 0; j < newArea.images.length; j++) {
                    this.uploadImage(newjob.jobid, area.areaid, newArea.images[j]);
                }
            }
        }

        // Save Bill
        let bill = new Bill();
        bill.jobid = newjob.jobid;
        bill.customerid = newjob.customerid;
        await connection.getRepository(Bill).save(bill);
        
        // Save BillItem
        let setting = await connection.getRepository(Settings).find({});
        for(let i = 0; i < setting.length; i++) {
            await this.createBillItem(newjob.jobid, 1, setting[i].name, 1, setting[i].value);
        }
        // await this.createBillItem(newjob.jobid, 1, setting[0].name, 1, setting[0].value);
        // await this.createBillItem(newjob.jobid, 1, 'Flood Restoration Risk Assessment Report', 1, setting[1].value);
        // await this.createBillItem(newjob.jobid, 1, 'IICRC Flood Restoration + Disaster Recovery + Water damage scope work', 1, setting[2].value);
        // await this.createBillItem(newjob.jobid, 1, 'IICRC Thermographer Assessment', 1, setting[3].value);
        // await this.createBillItem(newjob.jobid, 1, 'IICRC S-500 Project Manager - Normal Business Hours Rate (per hour)', 1, setting[4].value);
        // await this.createBillItem(newjob.jobid, 1, 'IICRC S-500 Supervisor - Normal Business Hours Rate (per hour)', 1, setting[5].value);
        // await this.createBillItem(newjob.jobid, 1, 'IICRC S-500 Technician - Normal Business Hours Rate (per hour)', 1, setting[6].value);
        // await this.createBillItem(newjob.jobid, 1, 'Air Movers Equipment (per day)', 1, setting[7].value);
        // await this.createBillItem(newjob.jobid, 1, 'Dehumidifier Equipment (per day)', 1, setting[8].value);
        // await this.createBillItem(newjob.jobid, 1, 'HEPA / AFD Equipment (per day)', 1, setting[9].value);
        // await this.createBillItem(newjob.jobid, 1, 'Waterextration Truck Mount (per liter)', 1, setting[10].value);
        // await this.createBillItem(newjob.jobid, 1, 'Flood Restoration Anti-Microbial Anti Browning Treatment and Deodorising & Sanitiser carpet (per sqm) ', 1, setting[11].value);
        // await this.createBillItem(newjob.jobid, 1, 'Restoration Drying Psychometric Daily Data Log (per day)', 1, setting[12].value)
        // for (let i = 13; i < setting.length; i++) {
        //     await this.createBillItem(newjob.jobid, 1, setting[i].name, 1, setting[i].value);
        // }
        return this.getResponse(200, newjob);
    }

    async createBillItem(jobId: number, order: number, text: string, qty: number, amount: string) {
        let connection = await this.getConnection();
        let billingItem = new Billitem();
        billingItem.jobid = jobId;
        billingItem.order = order;
        billingItem.name = text;
        billingItem.qty = qty;
        billingItem.amount = amount;
        billingItem.isboolean = false;
        billingItem = await connection.getRepository(Billitem).save(billingItem);
        return billingItem;
    }

    async getJobByCustomer(customerId: number) {
        let connection = await this.getConnection();
        let query = connection.getRepository(Job)
                    .createQueryBuilder("jj")
                    .innerJoin('address', 'a', 'a.addressid = jj.propertyaddressid')
                    .leftJoin('address', 'b', 'b.addressid = jj.billingaddressid')
                    .leftJoin('customer', 'c', 'c.customerid = jj.customerid')
                    .leftJoin('paymentmethod', 'pm', 'pm.paymentmethodid = jj.paymentmethodid');
        
        if (customerId !== NaN && customerId !== 0 ) {
            query.where('jj.customerid = :customerid', {customerid: customerId} );
        }
                    
        const list = await query.select([
                        'jj.jobid as jobid',
                        'jj.issp as issp',
                        'jj.jobnumber as jobnumber',
                        'jj.jobstatus as jobstatus',
                        'jj.jobtype as jobtype',
                        'jj.category as category',
                        'jj.class as class',
                        'jj.progress as progress',
                        'jj.estimate as estimate',
                        'c.name as customername',
                        'c.customerid as customerid',
                        'a.addressline1 as propertyaddressline1',
                        'a.addressline2 as propertyaddressline2',
                        'a.suburb as propertysuburb',
                        'a.postcode as propertypostcode',
                        'a.state as propertystate',
                        'b.addressline1 as billingaddressline1',
                        'b.addressline2 as billingaddressline2',
                        'b.suburb as billingsuburb',
                        'b.postcode as billingpostcode',
                        'b.state as billingstate',
                        'jj.DateOfLoss as dol',
                        'jj.FirstNoticeOfLoss as fnol',
                        'jj.arrivaldatetime as arrivaldate',
                        'jj.departuredatetime as departuredate',
                        'jj.waterextracted as waterextracted',
                        'jj.paymentmethodid as paymentmethodid',
                        'pm.name as paymentmethod'
                    ])
                    .getRawMany();
        return this.getResponse(200, list);
    }

    async getJobs() {
        return await this.getJobByCustomer(0);
    }

    async jobStats() {
        const connection = await this.getConnection();
        const jobs = await connection.getRepository(Job)
                            .createQueryBuilder('jj')
                            .select([
                                'jj.jobstatus as status',
                                'count(*) as count'
                            ]).groupBy('jj.jobstatus')
                            .getRawMany();
        return this.getResponse(200, jobs);
    }

    async getJob(jobId: number) {
        let connection = await this.getConnection();
        let single = await connection.getRepository(Job)
                    .findOne(jobId);
        let areas = await connection.getRepository(Area)
                    .find({jobid: jobId});
        let progress = await connection.getRepository(Jobprogress)
                    .find({jobid: jobId});
        let techs = await connection.getRepository(Wrttech)
                    .find({jobid: jobId});
        let billitems = await connection.getRepository(Billitem)
                    .find({jobid: jobId});
        let billing = await connection.getRepository(Address)
                        .findOne({addressid: single.billingaddressid});
        let property = await connection.getRepository(Address)
                        .findOne({addressid: single.propertyaddressid});
        let customer = await connection.getRepository(Customer)
                        .findOne({customerid: single.customerid});
                        
        
        let psychometrics = [];
        if (areas.length > 0) {
            const areaIds = areas.map(a => a.areaid);
            psychometrics = await connection.getRepository(Psychometric)
                            .createQueryBuilder('py')
                            .innerJoin("area", "aa", "aa.areaid = py.areaid")
                            .where("py.areaid in (:areaid)", { areaid: areaIds})
                            .select([
                                "py.psychometricid psychometricid",
                                "py.areaid areaid",
                                "aa.name name",
                                "py.day1 day1",
                                "py.day2 day2",
                                "py.day3 day3",
                                "py.day4 day4",
                                "py.day5 day5",
                                "py.day6 day6",
                                "py.day7 day7",
                                "py.day8 day8",
                                "py.day9 day9",
                                "py.day10 day10",
                                "py.day11 day11"
                            ])
                            .getRawMany();
        }
        single.areas = areas;
        single.technicians = techs;
        single.billItems = billitems;
        single.billschedule = progress;
        single.billingaddress = billing;
        single.propertyaddress = property;
        single.customer = customer;
        single.psychometrics = psychometrics;
        return this.getResponse(200, single);
    }

    async getSettings() {
        let connection = await this.getConnection();
        let settings = await connection.getRepository(Settings).find({});
        return this.getResponse(200, settings);
    }

    async addSetting(setting: setting) {
        let connection = await this.getConnection();
        let newsetting = new Settings();
        newsetting.name = setting.name;
        newsetting.value = setting.value;
        newsetting = await connection.getRepository(Settings).save(newsetting);
        return this.getResponse(200, newsetting);
    }
   
    async updateSetting(setting: setting, id: string) {
        let connection = await this.getConnection();
        let existingSetting = await connection.getRepository(Settings).findOne(id);
        existingSetting.name = setting.name;
        existingSetting.value = setting.value;
        existingSetting = await connection.getRepository(Settings).save(existingSetting);
        return this.getResponse(200, existingSetting);
    }

    async removeSetting(id: string) {
        let connection = await this.getConnection();
        let existingSetting = await connection.getRepository(Settings).findOne(id);
        await connection.getRepository(Settings).delete(existingSetting);
        return this.getResponse(200, existingSetting);
    }

    toDollar(str: string): string {
        return str;
    }
    async updateSettings(setting: setting, id: string) {
        let connection = await this.getConnection();
        let existing = await connection.getRepository(Settings).findOne(id);
        existing.value = setting.value;
        existing = await connection.getRepository(Settings).save(existing);
        return this.getResponse(200, existing);
    }
    async addJob(job: newjob) {
        //create new job
        let connection = await this.getConnection();

        // add address

        let billing = new Address();
        billing.addressline1 = job.billing.address1;
        billing.addressline2 = job.billing.address2;
        billing.suburb = job.billing.suburb;
        billing.state = job.billing.state;
        billing.postcode = job.billing.postcode;

        billing = await connection.getRepository(Address).save(billing);

        let property = new Address();
        property.addressline1 = job.property.address1;
        property.addressline2 = job.property.address2;
        property.suburb = job.property.suburb;
        property.state = job.property.state;
        property.postcode = job.property.postcode;

        property = await connection.getRepository(Address).save(property);

        let newjob = new Job();
        newjob.category = job.category;
        newjob.class = job.level;
        newjob.customerid = job.customerid;
        newjob.billingaddressid = billing.addressid;
        newjob.propertyaddressid = property.addressid;
        newjob.waterextracted = job.waterextraction;
        newjob.dateOfLoss = job.dol;
        newjob.firstNoticeOfLoss = job.fnol;
        newjob.arrivaldatetime = job.arrivaldate;
        newjob.departuredatetime = job.departuredate;
        newjob.paymentmethodid = job.paymentmethodid;
        newjob.jobstatus = job.jobstatus;
        newjob = await connection.getRepository(Job).save(newjob);
        // add areas
        for(let i = 0; i < job.areas.length; i++) {
            let a = job.areas[i];
            let newarea = new Area();
            newarea.jobid = newjob.jobid;
            newarea.name = a.name;
            newarea.goal = a.goal;
            newarea.progress = a.progress;
            newarea.dehumidifier = a.dehumidifier;
            newarea.decomissiondate = a.decomissiondate;
            newarea.afd = a.afd;
            newarea.airmovers = a.airmovers;

            newarea = await connection.getRepository(Area).save(newarea);
            
        }

        // add technician
        for(let i = 0; i < job.technicians.length; i++) {
            let t = job.technicians[i];
            let newtech = new Wrttech();
            newtech.jobid = newjob.jobid;
            newtech.name = t.name;
            newtech.mobile = t.mobile;

            newtech = await connection.getRepository(Wrttech).save(newtech);
            
        }

        // add bill items
        for(let i = 0; i < job.billitems.length; i++) {
            let b = job.billitems[i];
            let newbillitem = new Billitem();
            newbillitem.jobid = newjob.jobid;
            newbillitem.name = b.name;
            newbillitem.qty = b.qty;
            newbillitem.amount = b.amount;
            newbillitem.order = b.order;
            
            newbillitem = await connection.getRepository(Billitem).save(newbillitem);
        }
        // add payment schedule
        for(let i = 0; i < job.paymentschedules.length; i++) {
            let p = job.paymentschedules[i];
            let newprogress = new Jobprogress();
            newprogress.jobid = newjob.jobid;
            newprogress.order = p.order;
            
            newprogress = await connection.getRepository(Jobprogress).save(newprogress);
        }

        let newJ = await connection.getRepository(Job).findOne(newjob.jobid);

        return this.getResponse(200, newJ);
    }

    async addAreaToJob(area: area, jobid: number) {
        let connection = await this.getConnection();
        let newarea = new Area();
        newarea.jobid = jobid;
        newarea.afd = area.afd;
        newarea.airmovers = area.airmovers;
        newarea.decomissiondate = area.decomissiondate;
        newarea.dehumidifier = area.dehumidifier;
        newarea.progress = area.progress;
        newarea.goal = area.goal;
        newarea.name = area.name;
        newarea = await connection.getRepository(Area).save(newarea);
        // add psychometric data emptry values
        let newpsychometric = new Psychometric();
        newpsychometric.areaid = newarea.areaid;
        await connection.getRepository(Psychometric).save(newpsychometric);
        return this.getResponse(200, newarea);
    }

    async addTechnicianToJob(tech: technician, jobid: number) {
        let connection = await this.getConnection();
        let newtech = new Wrttech();
        newtech.name = tech.name;
        newtech.mobile = tech.mobile;
        newtech.jobid = jobid;
        newtech = await connection.getRepository(Wrttech).save(newtech);
        return this.getResponse(200, newtech);
    }

    async addBillItemToJob(tech: billitem, jobid: number) {
        let connection = await this.getConnection();
        let newbillitem = new Billitem();
        newbillitem.name = tech.name;
        newbillitem.qty = tech.qty;
        newbillitem.amount = tech.amount,
        newbillitem.order = tech.order;
        newbillitem.jobid = jobid;
        newbillitem = await connection.getRepository(Billitem).save(newbillitem);
        return this.getResponse(200, newbillitem);
    }

    async converQuoteToJob(jobid: number) {
        let connection = await this.getConnection();
        let job = await connection.getRepository(Job).findOne(jobid);
        job.jobstatus = 'JOB';
        // create bill items
        job = await connection.getRepository(Job).save(job);
        return this.getResponse(200, job);
    }

    async sendQuoteToCustomer(jobid: number, data: any) {
        const connection = await this.getConnection();
        const quote = await connection.getRepository(Job).findOne(jobid);
        const customer = await connection.getRepository(Customer).findOne(quote.customerid);
        const billitems = await connection.getRepository(Billitem).find({jobid: quote.jobid});

        const areas = await connection.getRepository(Area).find({jobid: quote.jobid});

        // insert area in text
        let areatext = '<table><thead><tr><td>Area Name</td><td>Air Movers</td><td>Dehumidifier</td><td>AFDs</td></tr></thead><tbody>'
        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];
            areatext += `<tr><td>${area.name}</td><td>${area.airmovers}</td><td>${area.dehumidifier}</td><td>${area.afd}</td></tr>`;
        }
        areatext += '</tbody></table>';


        // insert items in text email
        let items =  '<table><thead><tr><td>Item</td><td>Qty</td><td>Unit Price</td><td>Total</td></tr></thead><tbody>';
        for(let i = 0; i < billitems.length; i++) {
            const billitem = billitems[i];
            items += `<tr><td>${billitem.name}</td><td>${billitem.qty}</td><td>$${billitem.amount}</td><td>$${Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2}).format(billitem.qty * parseInt(billitem.amount, 10))}</td></tr>`;
        }
        items = items + '</tbody></table>';
        const message = `<html><body>Hi ${customer.name}, <p>Your quote for job ${quote.jobid} is $${quote.estimate}.</p><p>${areatext}</p><p>${items}</p><p>Regards,</p><p>1800Flood Sydney.</p></body></html>`;
        const subject = `1800Flood Sydney - Quote for job : ${quote.jobid}`;
        // const response = await this.sendEmail(customer.billingemail, subject, message);
        const response = await this.sendEmail( data.emaillist , subject, message);
        return this.getResponse(200, 'success');
    }
    async updateJobStatus(status: string, jobid: number) {
        let connection = await this.getConnection();
        let job = await connection.getRepository(Job).findOne(jobid);
        job.jobstatus = status;
        job = await connection.getRepository(Job).save(job);
        return this.getResponse(200, job);
    }

    async removeArea(areaid: number, jobid: number) {
        let connection = await this.getConnection();
        let area = await connection.getRepository(Area).findOne(areaid);
        area = await connection.getRepository(Area).remove(area);
        let psy = await connection.getRepository(Psychometric).findOne({areaid: areaid});
        await connection.getRepository(Psychometric).remove(psy);
        return this.getResponse(200, area);
    }

    async removeTechnician(technicianid: number, jobid: number) {
        let connection = await this.getConnection();
        let tech = await connection.getRepository(Wrttech).findOne(technicianid);
        tech = await connection.getRepository(Wrttech).remove(tech);
        return this.getResponse(200, tech);
    }

    async updateJobField(field: {name: string, value: string}, jobId: number) {
        let connection = await this.getConnection();
        let job = await connection.getRepository(Job).findOne(jobId);
        if (field.name === 'CATEGORY') {
            job.category = field.value;
        }
        if (field.name === 'CLASS') {
            job.class = field.value;
        }
        if (field.name === 'DOL') {
            job.dateOfLoss = new Date(field.value);
        }
        if (field.name === 'FNOL') {
            job.firstNoticeOfLoss = new Date(field.value);
        }
        if (field.name === 'ARRIVALDATE') {
            job.arrivaldatetime = new Date(field.value);
        }
        if (field.name === 'DEPARTUREDATE') {
            job.departuredatetime = new Date(field.value);
        }
        if (field.name === 'TYPE') {
            job.jobtype = field.value;
        }
        if (field.name === 'STATUS') {
            job.jobstatus = field.value;
        }
        if (field.name === 'ISSP') {
            job.isSp = field.value === 'true' ? true : false;
        }
        if (field.name === 'CUSTOMERID') {
            job.customerid = parseInt(field.value);
        }
        if (field.name === 'WATEREXTRACTED') {
            job.waterextracted = parseInt(field.value);
        }
        job = await connection.getRepository(Job).save(job);
        return this.getResponse(200, job);
    }

    async updateJobBillItem(billitem: billitem, billitemid: number, jobid: number) {
        let connection = await this.getConnection();
        let item = await connection.getRepository(Billitem).findOne(billitemid);
        item.name = billitem.name;
        item.order = billitem.order;
        item.qty = billitem.qty;
        item.amount = billitem.amount;
        item = await connection.getRepository(Billitem).save(item);
        return this.getResponse(200, item);
    }

    async updatePaymenetMethod(paymentmethodid: number, jobid: number) {
        let connection = await this.getConnection();
        let job = await connection.getRepository(Job).findOne(jobid);
        job.paymentmethodid = paymentmethodid;
        job = await connection.getRepository(Job).save(job);
        return this.getResponse(200, job);
    }

    async addPaymentSchedule(payment: paymentschedule, jobId: number) {
        let connection = await this.getConnection();
        let newpayment = new Jobprogress();
        newpayment.jobid = jobId;
        newpayment.order = payment.order;
        newpayment.progress = payment.progress;
        newpayment.amount = payment.amount;
        newpayment.paymentref = payment.paymentref;
        newpayment.datereceived = payment.datereceived;
        newpayment = await connection.getRepository(Jobprogress).save(newpayment);
        return this.getResponse(200, newpayment);
    }

    async removePaymentSchedule(jobprogressid: number, jobId: number) {
        let connection = await this.getConnection();
        let payment = await connection.getRepository(Jobprogress).findOne(jobprogressid);
        payment = await connection.getRepository(Jobprogress).remove(payment);
        return this.getResponse(200, payment);
    }

    async updatePaymentSchedule(schedule: paymentschedule, scheduleId: number) {
        let connection = await this.getConnection();
        let payment = await connection.getRepository(Jobprogress).findOne(scheduleId);
        payment.amount = schedule.amount;
        payment.datereceived = schedule.datereceived;
        payment.paymentref = schedule.paymentref;
        payment.progress = schedule.progress;
        payment = await connection.getRepository(Jobprogress).save(payment);
        return this.getResponse(200, payment);
    }

    async updateJobProgress(jobId) {
        const connection = await this.getConnection();
        let job = await connection.getRepository(Job).findOne(jobId);
        let areas = await connection.getRepository(Area).find({jobid: jobId});
        let progress = 0.00;
        for(let i = 0; i < areas.length; i++) {
            const area = areas[i];
            progress = progress + parseFloat(area.progress.toString());
        }
        progress = (progress / areas.length);
        job.progress = progress.toFixed(2);
        job = await connection.getRepository(Job).save(job);
    }
    async updateJobArea(area: area, areaid: number, jobId: number) {
        let connection = await this.getConnection();
        let newarea = await connection.getRepository(Area).findOne(areaid);
        newarea.afd = area.afd;
        newarea.airmovers = area.airmovers;
        newarea.decomissiondate = area.decomissiondate;
        newarea.dehumidifier = area.dehumidifier;
        newarea.progress = area.progress;
        newarea.goal = area.goal;
        newarea.name = area.name;
        newarea.jobid = jobId;
        newarea = await connection.getRepository(Area).save(newarea);
        await this.updateJobProgress(jobId);
        return this.getResponse(200, newarea);
    }

    async updateJobTechnician(tech: technician, techid: number, jobid: number) {
        let connection = await this.getConnection();
        let technician = await connection.getRepository(Wrttech).findOne(techid);
        technician.name = tech.name;
        technician.mobile = tech.mobile;
        technician.jobid = jobid;
        technician = await connection.getRepository(Wrttech).save(technician);
        return this.getResponse(200, technician);
    }

    async updateAddress(add: address, addid: number) {
        let connection = await this.getConnection();
        let address_e = await connection.getRepository(Address).findOne(addid);
        address_e.addressline1 = add.addressline1;
        address_e.addressline2 = add.addressline2;
        address_e.suburb = add.suburb;
        address_e.state = add.state;
        address_e.postcode = add.postcode;
        address_e.contact = add.contact;
        address_e = await connection.getRepository(Address).save(address_e);
        return this.getResponse(200, address_e);
    }

     getFile (fileMime, buffer) {
        let fileExt = fileMime;
        let fileName = moment(new Date()).unix() + '.' + fileExt;
        let fileFullPath = 's3://1800invoice/' + fileName;

        let params:  PutObjectRequest = {
            Bucket: '1800invoice',
            Key: fileName,
            Body: buffer,
            ContentType: 'application/pdf',
            ACL: 'public-read',
        };

        return {
            fileFullPath: fileFullPath,
            fileName: fileName,
            params: params
        };
    }

    async getImages(jobId: number) {
        let connection = await this.getConnection();
        let images = await connection.getRepository(Image).find({jobid: jobId});
        return this.getResponse(200, images);
    }

    async deleteImage(imageId: number) {
        let connection = await this.getConnection();
        let image = await connection.getRepository(Image).findOne(imageId);
        await connection.getRepository(Image).delete(image);
        return this.getResponse(200, image);
    }
    async insertImage(jobId: number, areaId: number, fileName: string, fileLocation: string) {
        let connection = await this.getConnection();
        let newImage = new Image();
        newImage.name = fileName;
        newImage.location = fileLocation;
        newImage.jobid = jobId;
        newImage.areaid = areaId;
        newImage = await connection.getRepository(Image).save(newImage);
        return newImage;
    }

    async uploadFile (format: string, data: any) {
        let buffer = Buffer.from(data, 'base64');
        const fileName =  moment(new Date()).unix() + '.' + format;
        let params:  PutObjectRequest = {
            Bucket: '1800invoice',
            Key: fileName,
            Body: buffer,
            ACL: 'public-read',
        };
        const response = await this.uploadS3File(params);
        return this.getResponse(200, response);
    }

    async uploadImage (jobId: number, areaId: number, data: any) {
        if (data === '') 
            return;
        let buffer = Buffer.from(data, 'base64');
        let fileMime = 'jpeg';
        console.log('filemime', fileMime);
        if (fileMime === null) {
            return this.getResponse(401, {success: 'unable to find file type'});
        }
        let fileExt = fileMime;
        let fileName = moment(new Date()).unix() + '.' + fileExt;
        
        let params:  PutObjectRequest = {
            Bucket: '1800invoice/images',
            Key: fileName,
            Body: buffer,
            ACL: 'public-read',
        };
        const response = await this.uploadS3File(params);
        const image  = await this.insertImage(jobId, areaId, fileName, response.Location);
        return this.getResponse(200, image);
    }

    async uploadPdf (jobId: number, data: any) {
        let buffer = Buffer.from(data, 'base64');
        let fileMime = 'pdf';
        let fileExt = fileMime;
        let fileName = moment(new Date()).unix() + '.' + fileExt;
        let params:  PutObjectRequest = {
            Bucket: '1800invoice',
            Key: fileName,
            Body: buffer,
            ACL: 'public-read',
        };
        const response = await this.uploadS3File(params);
        await this.updatePdfLocation(jobId, response.Location);
        return this.getResponse(200, response);
    }

    async updatePdfLocation(jobId: number, location: string) {
        const connection = await this.getConnection();
        const job = await connection.getRepository(Job).findOne(jobId);
        const bill = await connection.getRepository(Bill).findOne({jobid: job.jobid});
        bill.pdflocation = location;
        await connection.getRepository(Bill).save(bill);
    }

    uploadS3File(params) {
        return new Promise<{Location: string}>((resolve, reject) => {
            const s3 = new AWS.S3();
            s3.upload(params, function(err, data) {
                if (err) {
                    console.log('error', err);
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    downloadPdfFile(location: any): Promise<{responsecode: number ,body: any}> {
        return new Promise<{responsecode: number ,body: any}>((resolve, reject) => {
            const s3 = new AWS.S3();

            const filename = path.basename(location.data);
            const params: GetObjectRequest = {
                Bucket: '1800invoice',
                Key: filename,
            };

            const myBucket = '1800invoice';
            const myKey = filename;
            const signedUrlExpireSeconds = 60 * 5;

            const url = s3.getSignedUrl('getObject', {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds
            }, function(err, url) {
                if (!err) {
                    resolve({responsecode: 200, body: url});
                } else {
                    console.log(err);
                    reject({responsecode: 300, body: ''});
                }
            })
        });
    }

    async getJobBills(jobId: number) {
        const connection = await this.getConnection();
        const bills = await connection.getRepository(Bill).find({jobid: jobId});
        return this.getResponse(200, bills);
    }

    async addPsychometric(jobId: number, areaId: number, item: any) {
        const connection = await this.getConnection();
        let newItem = new Psychometric();
        newItem.areaid = areaId;
        newItem.day1 = item.day1; 
        newItem.day2 = item.day2; 
        newItem.day3 = item.day3; 
        newItem.day4 = item.day4; 
        newItem.day5 = item.day5; 
        newItem.day6 = item.day6; 
        newItem.day7 = item.day7; 
        newItem.day8 = item.day8; 
        newItem.day9 = item.day9; 
        newItem.day10 = item.day10;
        newItem.day11 = item.day11;
        newItem = await connection.getRepository(Psychometric).save(newItem);
        return this.getResponse(200, newItem);
    }

    async deletePsychometric(id: any) {
        const connection = await this.getConnection();
        const psychometric = await connection.getRepository(Psychometric).findOne(id);
        await connection.getRepository(Psychometric).delete(psychometric);
        return this.getResponse(200, psychometric);
    }

    async updatePsychometric(item: any) {
        const connection = await this.getConnection();
        let newItem = await connection.getRepository(Psychometric).findOne(item.psychometricid);
        newItem.day1 = item.day1; 
        newItem.day2 = item.day2; 
        newItem.day3 = item.day3; 
        newItem.day4 = item.day4; 
        newItem.day5 = item.day5; 
        newItem.day6 = item.day6; 
        newItem.day7 = item.day7; 
        newItem.day8 = item.day8; 
        newItem.day9 = item.day9; 
        newItem.day10 = item.day10;
        newItem.day11 = item.day11;
        newItem = await connection.getRepository(Psychometric).save(newItem);
        return this.getResponse(200, newItem);
    }

    async getPsychometrics(jobId: number) {
        const connection = await this.getConnection();
        const areas = await connection.getRepository(Area).find({jobid: jobId});
        let list = [];
        for(let i = 0; i < areas.length; i++) {
            const area = areas[i];
            const tests = await connection.getRepository(Psychometric).find({areaid: area.areaid });
            list.push({area: area.name, list: tests});
        }
        return this.getResponse(200, list);
    }
}