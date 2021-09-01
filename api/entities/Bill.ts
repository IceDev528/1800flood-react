import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("bill", { schema: "flood1800" })
export class Bill {
  @PrimaryGeneratedColumn({ type: "int", name: "billid" })
  billid: number;

  @Column("int", { name: "jobid", nullable: true })
  jobid: number | null;

  @Column("int", { name: "customerid", nullable: true })
  customerid: number | null;

  @Column("varchar", { name: "pdflocation", nullable: true, length: 200 })
  pdflocation: string | null;

  @Column("bit", {
    name: "isemailsent",
    nullable: true,
    default: () => "'b'0''"
  })
  isemailsent: boolean | null;
}
