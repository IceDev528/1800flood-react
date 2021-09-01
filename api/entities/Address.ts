import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("address", { schema: "flood1800" })
export class Address {
  @PrimaryGeneratedColumn({ type: "int", name: "addressid" })
  addressid: number;

  @Column("varchar", { name: "contact", nullable: true, length: 100 })
  contact: string | null;

  @Column("varchar", { name: "addressline1", nullable: true, length: 100 })
  addressline1: string | null;

  @Column("varchar", { name: "addressline2", nullable: true, length: 100 })
  addressline2: string | null;

  @Column("varchar", { name: "suburb", nullable: true, length: 50 })
  suburb: string | null;

  @Column("varchar", { name: "state", nullable: true, length: 50 })
  state: string | null;

  @Column("varchar", { name: "postcode", nullable: true, length: 10 })
  postcode: string | null;
}
