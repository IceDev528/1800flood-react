import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("channel", { schema: "flood1800" })
export class Channel {
  @PrimaryGeneratedColumn({ type: "int", name: "channelid" })
  channelId: number;

  @Column("int", { name: "userid", nullable: true })
  userId: number | null;ß

  @Column("int", { name: "admin", nullable: true })
  admin: number | null;

  @Column("datetime", {
	name: "createddate",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP"
  })
  createdDate: boolean | null;
}
