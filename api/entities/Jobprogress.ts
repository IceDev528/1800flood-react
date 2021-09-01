import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("jobprogress", { schema: "flood1800" })
export class Jobprogress {
  @PrimaryGeneratedColumn({ type: "int", name: "jobprogressid" })
  jobprogressid: number;

  @Column("int", { name: "jobid", nullable: true })
  jobid: number | null;

  @Column("int", { name: "order", nullable: true })
  order: number | null;

  @Column("datetime", { name: "datereceived", nullable: true })
  datereceived: Date | null;

  @Column("varchar", { name: "paymentref", nullable: true, default: '' })
  paymentref: string | null;

  @Column("decimal", { name: "amount", nullable: true, precision: 10, scale: 2 })
  amount: number | null;

  @Column("decimal", {
    name: "progress",
    nullable: true,
    precision: 10,
    scale: 2
  })
  progress: number | null;
}
