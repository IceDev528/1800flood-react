import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("billitem", { schema: "flood1800" })
export class Billitem {
  @PrimaryGeneratedColumn({ type: "int", name: "billitemid" })
  billitemid: number;

  @Column("varchar", { name: "name", nullable: true, length: 200 })
  name: string | null;

  @Column("int", { name: "qty", nullable: true })
  qty: number | null;

  @Column("int", { name: "jobid", nullable: true })
  jobid: number | null;

  @Column("int", { name: "order", nullable: true })
  order: number | null;

  @Column("decimal", {
    name: "amount",
    nullable: true,
    precision: 10,
    scale: 2
  })
  amount: string | null;

  @Column("bit", { name: "isboolean", nullable: true, default: () => "'b'0''" })
  isboolean: boolean | null;
}
