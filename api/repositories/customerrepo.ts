import { ConnectionOptions } from "typeorm";
import { baserepo } from "./baserepo";
import { user, customer } from "../models/models";
import { User } from "../entities/User";
import { Customer } from "../entities/Customer";

export class customerrepo extends baserepo {
    /**
     *
     */
    constructor(config: ConnectionOptions) {
        super(config);

    }

    async getcustomers() {
        let connection = await this.getConnection();
        let customers = await connection.getRepository(Customer).createQueryBuilder("cc").getMany();
        return this.getResponse(200, customers);
    }

    async adduser(user: user, customerid: number) {
        let connection = await this.getConnection();
        let newuser = new User();
        newuser.email = user.email;
        newuser.firstname = user.firstname;
        newuser.lastname = user.lastname;
        newuser.mobile = user.mobile;
        newuser.password = user.password;
        newuser.verificationcode = user.activationcode;
        newuser.isactive = false;
        newuser.customerid = customerid;
        await connection.getRepository(User).save(newuser);
    }

    async removeuser(userid: number, customerid: number) {
        let connection = await this.getConnection();
        let user = await connection.getRepository(User).findOne(userid);
        await connection.getRepository(User).remove(user);
    }

    async addCustomer(customer: customer) {
        let connection = await this.getConnection();
        let newCustomer = new Customer();
        newCustomer.name = customer.name;
        newCustomer.billingemail = customer.billingemail;
        newCustomer.phonenumber = customer.phonenumber;
        newCustomer = await connection.getRepository(Customer).save(newCustomer);
        return this.getResponse(200, newCustomer);
    }
}