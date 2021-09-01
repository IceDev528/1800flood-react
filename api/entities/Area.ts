import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("area", { schema: "flood1800" })
export class Area {
  @PrimaryGeneratedColumn({ type: "int", name: "areaid" })
  areaid: number;

  @Column("int", { name: "jobid", nullable: true })
  jobid: number | null;

  @Column("decimal", {
    name: "goal",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'"
  })
  goal: number | null;

  @Column("decimal", {
    name: "progress",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'"
  })
  progress: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 200 })
  name: string | null;

  @Column("int", { name: "airmovers", nullable: true, default: () => "'0'" })
  airmovers: number | null;

  @Column("int", { name: "dehumidifer", nullable: true, default: () => "'0'" })
  dehumidifier: number | null;

  @Column("int", { name: "afd", nullable: true, default: () => "'0'" })
  afd: number | null;

  @Column("datetime", {
    name: "decomissiondate",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  decomissiondate: Date | null;
}
