import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Area } from "./Area";
import { Wrttech } from "./Wrttech";
import { Billitem } from "./Billitem";
import { Jobprogress } from "./Jobprogress";
import { Address } from "./Address";
import { Customer } from "./Customer";
import { Psychometric } from "./Psychometric";

@Entity("job", { schema: "flood1800" })
export class Job {
  @PrimaryGeneratedColumn({ type: "int", name: "jobid" })
  jobid: number;

  @Column("int", {
    name: "jobnumber",
    nullable: true,
    default: () => "'300001'"
  })
  jobnumber: number | null;

  @Column("varchar", {
    name: "category",
    nullable: true,
    length: 20,
    default: () => "'Category 1'"
  })
  category: string | null;

  @Column("varchar", {
    name: "jobstatus",
    nullable: true,
    length: 20,
    default: () => "'OPEN'"
  })
  jobstatus: string | null;

  @Column("varchar", {
    name: "jobtype",
    nullable: true,
    length: 20,
    default: () => "'QUOTE'"
  })
  jobtype: string | null;

  @Column("varchar", {
    name: "class",
    nullable: true,
    length: 10,
    default: () => "'Calss 1'"
  })
  class: string | null;

  @Column("int", { name: "billingaddressid", nullable: true })
  billingaddressid: number | null;

  @Column("int", { name: "propertyaddressid", nullable: true })
  propertyaddressid: number | null;

  @Column("decimal", {
    name: "progress",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'"
  })
  progress: string | null;

  @Column("boolean", { name: "isSP", nullable: true, default: () => "'b'0''" })
  isSp: boolean | null;

  @Column("datetime", {
    name: "DateOfLoss",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  dateOfLoss: Date | null;

  @Column("datetime", {
    name: "FirstNoticeOfLoss",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  firstNoticeOfLoss: Date | null;

  @Column("datetime", {
    name: "arrivaldatetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  arrivaldatetime: Date | null;

  @Column("datetime", {
    name: "departuredatetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  departuredatetime: Date | null;

  @Column("int", {
    name: "waterextracted",
    nullable: true,
    default: () => "'0'"
  })
  waterextracted: number | null;

  @Column("int", {
    name: "pmhours",
    nullable: true,
    default: () => "'0'"
  })
  pmhours: number | null;

  @Column("int", {
    name: "techhours",
    nullable: true,
    default: () => "'0'"
  })
  techhours: number | null;

  @Column("int", {
    name: "supervisorhours",
    nullable: true,
    default: () => "'0'"
  })
  supervisorhours: number | null;

  @Column("int", { name: "paymentmethodid", nullable: true })
  paymentmethodid: number | null;

  @Column("int", { name: "customerid", nullable: true })
  customerid: number | null;

  @Column("decimal", {
    name: "estimate",
    nullable: true,
    precision: 10,
    scale: 2
  })
  estimate: string | null;

  areas: Array<Area> | null;
  technicians: Array<Wrttech> | null;
  billschedule: Array<Jobprogress> | null;
  billItems: Array<Billitem> | null;

  billingaddress: Address | null;
  propertyaddress: Address | null;
  customer: Customer | null;
  psychometrics: Array<Psychometric> | null;
}
