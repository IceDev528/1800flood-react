import { ConnectionOptions, getConnectionManager } from "typeorm";
import { Connection } from "typeorm";
import mailgun from 'mailgun-js';

export class baserepo {

    connectionOptions: ConnectionOptions;

    constructor (connectionOption: ConnectionOptions) {
        this.connectionOptions = connectionOption;
    }

    getConnection() : Promise<Connection> {
        return new Promise((resolve, reject) => {
            try {            
                let connection: Connection;
                const connectionManager = getConnectionManager();            
                console.log('calling get connection');
                if (connectionManager.has('default')) {
                    console.log('========= get from catch ================');
                    connection = connectionManager.get("default");                
                    resolve(connection);
                } else {
                    connection = connectionManager.create(this.connectionOptions);
                    resolve(connection.connect());
                }
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    async getResponse(code: number, result: any) {
        return {responsecode: code, body: result};
    }

    sendEmail(to: string, subject: string, body: string) {
        return new Promise((resolve, reject) => {
            const DOMAIN = "sandbox3c6443f41deb48d286d778d0b92b7c89.mailgun.org";
            const mg = mailgun({apiKey: "b3e081db78fcc9022f2392cb094c81f6-aa4b0867-635180de", domain: DOMAIN});
            const data = {
                from: "Mailgun Sandbox <postmaster@sandbox3c6443f41deb48d286d778d0b92b7c89.mailgun.org>",
                to: to,
                subject: subject,
                text: body,
                html: body,
            };
            mg.messages().send(data, function (error, body) {
                if (!error) {
                    console.log(body);
                    resolve(body);
                } 
                reject(error);
            });
        });
    }

}