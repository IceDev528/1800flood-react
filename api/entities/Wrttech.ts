import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("wrttech", { schema: "flood1800" })
export class Wrttech {
  @PrimaryGeneratedColumn({ type: "int", name: "wrttechid" })
  wrttechid: number;

  @Column("varchar", { name: "name", nullable: true, length: 50 })
  name: string | null;

  @Column("varchar", { name: "mobile", nullable: true, length: 10 })
  mobile: string | null;

  @Column("int", { name: "jobid", nullable: true })
  jobid: number | null;
}
