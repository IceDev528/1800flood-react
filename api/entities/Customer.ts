import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customer", { schema: "flood1800" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "int", name: "customerid" })
  customerid: number;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("varchar", { name: "phonenumber", nullable: true, length: 100 })
  phonenumber: string | null;
  
  @Column("varchar", { name: "billingemail", nullable: true, length: 100 })
  billingemail: string | null;

  @Column("int", { name: "billingaddressid", nullable: true })
  billingaddressid: number | null;
}
