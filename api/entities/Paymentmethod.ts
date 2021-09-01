import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("paymentmethod", { schema: "flood1800" })
export class Paymentmethod {
  @PrimaryGeneratedColumn({ type: "int", name: "paymentmethodid" })
  paymentmethodid: number;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;
}
