import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("message", { schema: "flood1800" })
export class Message {
  @PrimaryGeneratedColumn({ type: "int", name: "messageid" })
  messageid: number;

  @Column("int", { name: "channelid", nullable: true })
  channelid: number | null;

  @Column("int", { name: "userid", nullable: true })
  userid: number | null;

  @Column("varchar", { name: "message", nullable: true, length: 200 })
  message: string | null;

  @Column("datetime", {
	name: "createddate",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP"
  })
  createdDate: boolean | null;
}
