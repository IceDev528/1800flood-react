import { jobrepo } from  './repositories/jobrepo';
import { customerrepo } from  './repositories/customerrepo';
import { userrepo } from  './repositories/userrepo';
import { messagerepo } from './repositories/messagerepo';

import { ConnectionOptions } from 'typeorm';
import { HttpMethod, QueryOption } from './models/models';


export class ResponseBuilder {

  resource: string;
  method: string;
  body: any;
  connectionOptions: ConnectionOptions;
  queryString: QueryOption;
  pathParameters: any;

  constructor(connectionoptions: ConnectionOptions, 
              method: string, 
              resource: string, 
              queryString: any, 
              pathParameters: any,
              body: any) {
    this.resource = resource; 
    this.method = method;
    this.connectionOptions = connectionoptions;
    this.queryString = queryString;
    this.pathParameters = pathParameters;
    this.body = body;
    console.log(this.connectionOptions);
  }

  async getResponse() : Promise<{responsecode: number, body: any}> {

    let jRepo = new jobrepo(this.connectionOptions);
    let cRepo = new customerrepo(this.connectionOptions);
    let uRepo = new userrepo(this.connectionOptions);
    let mRepo = new messagerepo(this.connectionOptions);
    // GET
    if (this.method === HttpMethod.GET) {
      if (this.resource === '/jobs') {
        return await jRepo.getJobs();
      }
      if (this.resource === '/jobs/{id}') {
        let id = this.pathParameters.id;
        return await jRepo.getJob(id);
      }
      if (this.resource === '/jobs/{id}/bills') {
        let id = this.pathParameters.id;
        return await jRepo.getJobBills(id);
      }
      if (this.resource === '/customers') {
        return await cRepo.getcustomers();
      }
      if (this.resource === '/addresses') {
        return await jRepo.getAddresses(this.pathParameters);
      }
      if (this.resource === '/addresses/{id}') {
        let id = this.pathParameters.id;
        return await jRepo.getAddress(id);
      }
      if (this.resource === '/customers/{id}/jobs') {
        let custid = this.pathParameters.id;
        return await jRepo.getJobByCustomer(custid);
      }
      if (this.resource === '/customers/{id}/jobs/{jobid}') {
        let custid = this.pathParameters.id;
        let jobid = this.pathParameters.jobid;
        return await jRepo.getJob(jobid);
      }
      if (this.resource === '/users/{email}') {
        let email = this.pathParameters.email;
        return await uRepo.getUserDetails(email);
      }
      if (this.resource === '/settings') {
        return await jRepo.getSettings();
      }
      if (this.resource === '/users') {
        return await uRepo.getUsers();
      }
      if (this.resource === '/jobs/{id}/areas/{areaid}/images') {
        let jobId = this.pathParameters.id;
        return await jRepo.getImages(jobId);
      }
      if (this.resource === '/channels') {
        return await mRepo.getChannels();
      }
      if (this.resource === '/channels/{id}') {
        const id = this.pathParameters.id;
        return await mRepo.getChannel(id)
      }
      if (this.resource === '/jobs/{id}') {
        let jobId = this.pathParameters.id;
        return await jRepo.getPsychometrics(jobId);
      }
      if (this.resource === '/jobs/stats') {
        return await jRepo.jobStats();
      }
    }
    // PUT
    if (this.method === HttpMethod.PUT) {
      if (this.resource === '/settings/{id}') {
        let setting = this.body;
        let id = this.pathParameters.id;
        return await jRepo.updateSettings(setting, id);
      }
      if (this.resource === '/jobs/{id}/areas/{areaid}') {
        let jobid = this.pathParameters.id;
        let areaid = this.pathParameters.areaid;
        let area = this.body;
        return await jRepo.updateJobArea(area, areaid, jobid);
      }
      if (this.resource === '/jobs/{id}/billitems/{billitemid}') {
        let jobid = this.pathParameters.id;
        let billitemid = this.pathParameters.billitemid;
        let billitem = this.body;
        return await jRepo.updateJobBillItem(billitem, billitemid, jobid);
      }
      if (this.resource === '/jobs/{id}/field') {
        let jobid = this.pathParameters.id;
        let field = this.body;
        return await jRepo.updateJobField(field, jobid);
      }
      if (this.resource === '/jobs/{id}/technicians/{techid}') {
        let jobid = this.pathParameters.id;
        let techid = this.pathParameters.technicianid;
        let technician = this.body;
        return await jRepo.updateJobTechnician(technician, techid, jobid);
      }
      if (this.resource === '/addresses/{id}') {
        let addressid = this.pathParameters.id;
        let address = this.body;
        return await jRepo.updateAddress(address, addressid);
      }
      if (this.resource === '/settings/{id}') {
        let settingId = this.pathParameters.id;
        let setting = this.body;
        return await jRepo.updateSetting(setting, settingId);
      }
      if (this.resource === '/jobs/{id}/areas/{areaid}/psychometrics/{psychometricid}') {
        let body = this.body;
        let id = this.pathParameters.id;
        let areaId = this.pathParameters.areaid;
        let psychometricId = this.pathParameters.psychometricid;
        return await jRepo.updatePsychometric(body);
      }
      if (this.resource === '/jobs/{id}/billschedule/{billscheduleid}') {
        let body = this.body;
        let id = this.pathParameters.id;
        let scheduleId = this.pathParameters.billscheduleid;
        return await jRepo.updatePaymentSchedule(body, scheduleId);
      }
    }
    // POST
    if (this.method === HttpMethod.POST) {
      if (this.resource === '/jobs') {
        let job = this.body;
        return await jRepo.addJob(job);
      }
      if (this.resource === '/quotes') {
        let quote = this.body;
        return await jRepo.addQuote(quote);
      }
      if (this.resource === '/quotes/{id}/convert') {
        let jobid = this.pathParameters.id;
        return await jRepo.converQuoteToJob(jobid);
      }
      if (this.resource === '/quotes/{id}/sendquote') {
        let jobid = this.pathParameters.id;
        let data = this.body;
        return await jRepo.sendQuoteToCustomer(jobid, data);
      }
      if (this.resource === '/jobs/{id}/areas') {
        let area = this.body;
        let jobid = this.pathParameters.id;
        return await jRepo.addAreaToJob(area, jobid);
      }
      if (this.resource === '/jobs/{id}/technicians') {
        let tech = this.body;
        let jobid = this.pathParameters.id;
        return await jRepo.addTechnicianToJob(tech, jobid);
      }
      if (this.resource === '/jobs/{id}/billitems') {
        let item = this.body;
        let jobid = this.pathParameters.id;
        return await jRepo.addBillItemToJob(item, jobid);
      }
      if (this.resource === '/jobs/{id}/billschedule') {
        let schedule = this.body;
        let jobid = this.pathParameters.id;
        return await jRepo.addPaymentSchedule(schedule, jobid);
      }
      if (this.resource === '/jobs/{id}/uploadpdf') {
        let data = this.body;
        let jobid = this.pathParameters.id;
        return await jRepo.uploadPdf(jobid, data);
      }
      if (this.resource === '/register') {
        let register =  this.body;
        uRepo.registerUser(register).catch(err=>{
          return err;
        });
        return await uRepo.insertUser(register);
      }
      if (this.resource === '/login') {
        let login = this.body;
        return await uRepo.login(login);
      }
      if (this.resource === '/validatetoken') {
        let token = this.body;
        return await uRepo.verifyToken(token);
      }
      if (this.resource === '/resetpassword') {
        let body = this.body;
        return await uRepo.updatePassword(body);
      }
      if (this.resource === '/jobs/{id}/downloadinvoice') {
        let body = this.body;
        let id = this.pathParameters.id;
        return await jRepo.downloadPdfFile(body);
      }
      if (this.resource === '/users/{id}/activate') {
        let userid = this.pathParameters.id;
        let data = this.body;
        return await uRepo.activateUser(userid, data);
      }
      if (this.resource === '/settings') {
        let setting = this.body;
        return await jRepo.addSetting(setting);
      }
      if (this.resource === '/customers') {
        let customer = this.body;
        return await cRepo.addCustomer(customer);
      }
      if (this.resource === '/jobs/{id}/areas/{areaid}/images') {
        let jobId = this.pathParameters.id;
        let areaId = this.pathParameters.areaid;
        return await jRepo.uploadImage(jobId, areaId, this.body);
      }
      if (this.resource === '/channels') {
        let channel = this.body;
        return await mRepo.createChannel(channel);
      }
      if (this.resource === '/channels/{id}/messages') {
        const channelId = this.pathParameters.id;
        let message = this.body;
        return await mRepo.createMessage(channelId, message);
      }
      if (this.resource === '/jobs/{id}/areas/{areaid}/psychometrics') {
        const body = this.body;
        const jobId = this.pathParameters.id;
        const areaId = this.pathParameters.areaid;
        return await jRepo.addPsychometric(jobId, areaId, body);
      }
      if (this.resource === '/users/{id}/channels') {
        let userId = this.pathParameters.id;
        let isAdmin = this.body.isAdmin;
        return await uRepo.getUserWithChannel(userId, isAdmin);
      }
    }
    // DEL
    if (this.method === HttpMethod.DEL) {
      if (this.resource === '/jobs/{id}/areas/{areaid}') {
        let areaid = this.pathParameters.areaid;
        let jobid = this.pathParameters.id;
        return await jRepo.removeArea(areaid, jobid);
      }
      if (this.resource === '/jobs/{id}/technicians/{techid}') {
        let techid = this.pathParameters.techid;
        let jobid = this.pathParameters.id;
        return await jRepo.removeTechnician(techid, jobid);
      }
      if (this.resource === '/jobs/{id}/billschedule/{progressid}') {
        let progressid = this.pathParameters.progressid;
        let jobid = this.pathParameters.jobid;
        return await jRepo.removePaymentSchedule(progressid, jobid);
      }
      if (this.resource === '/settings/{id}') {
        let settingId = this.pathParameters.id;
        return await jRepo.removeSetting(settingId);
      }
      if (this.resource === '/jobs/{id}/images/{imageId}') {
        let imageId = this.pathParameters.imageId;
        return await jRepo.deleteImage(imageId);
      }
      if (this.resource === '/jobs/{id}/billschedule/{billscheduleid}') {
        let billscheduleId = this.pathParameters.billscheduleId;
        let jobId = this.pathParameters.id;
        return await jRepo.removePaymentSchedule(billscheduleId, jobId);
      }
    }

    // OPTIONS
    if (this.method === HttpMethod.OPTIONS) {
      return await jRepo.getResponse(200, 'Ok');
    }

    return await jRepo.getResponse(200, 'OK');
  }
}