import { ConnectionOptions } from "typeorm";
import { baserepo } from "./baserepo";
import { user, customer } from "../models/models";
import { User } from "../entities/User";
import { Customer } from "../entities/Customer";
import { Channel } from "../entities/Channel";
import { Message } from "../entities/Message";

export class messagerepo extends baserepo {
    /**
     *
     */
    constructor(config: ConnectionOptions) {
        super(config);
    }

    async createChannel(newChannel: any) {
		const connection = await this.getConnection();
		let channel = new Channel();
		channel.admin = newChannel.admin;
		channel.userId = newChannel.userid;
		channel = await connection.getRepository(Channel).save(channel);
		return this.getResponse(200, channel);
	};

	async removeChannel(channelId: any) {
		const connection = await this.getConnection();
		const channel = await connection.getRepository(Channel).findOne(channelId);
		await connection.getRepository(Channel).remove(channel);
		return this.getResponse(200, channel);
	};

	async getChannels() {
		const connection = await this.getConnection();
		let result = await connection.getRepository(Channel)
						.createQueryBuilder('ch')
						.innerJoin('user', 'ur', 'ur.userid = ch.userid')
						.innerJoin('customer', 'cu', 'cu.customerid = ur.customerid')
						.select([
							'ch.channelid as channelid',
							'cu.name as name',
							'ur.firstname as fistname',
							'ur.lastname as lastname',
							'ch.createddate as createddate'
						]).getRawMany();
		console.log(result);
		return this.getResponse(200, result );
	};

	async getChannel(channelId: any) {
		const connection = await this.getConnection();
		let result = await connection.getRepository(Message)
						.createQueryBuilder('msg')
						.innerJoin('channel', 'ch', 'ch.channelid = msg.channelid')
						.innerJoin('user', 'ur', 'ur.userid = msg.userid')
						.where('msg.channelid = :channelId', { channelId: channelId})
						.select([
							'ur.firstname as firstname',
							'ur.lastname as lastname',
							'msg.message as message',
							'msg.createddate as createddate',
							'msg.messageid as messageid',
							'ur.userid as userid'
						]).getRawMany();
		const channel = { channelId: channelId, messages: result}
		return this.getResponse(200, channel);
	}

	async createMessage(channelId: number, message: any) {
		const connection = await this.getConnection();
		let newMessage = new Message();
		newMessage.channelid = channelId;
		newMessage.message = message.message;
		newMessage.userid = message.userid;
		newMessage = await connection.getRepository(Message).save(newMessage);
		return this.getResponse(200, newMessage);
	}

}