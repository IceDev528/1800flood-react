import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("psychometric", { schema: "flood1800" })
export class Psychometric {
  @PrimaryGeneratedColumn({ type: "int", name: "psychometricid" })
  psychometricid: number;

  @Column("int", { name: "areaid", nullable: true })
  areaid: number | null;

  @Column("int", { name: "day1", nullable: false, default: 0 })
  day1: string | null;

  @Column("int", { name: "day2", nullable: false, default: 0 })
  day2: string | null;

  @Column("int", { name: "day3", nullable: false, default: 0 })
  day3: string | null;
  
  @Column("int", { name: "day4", nullable: false, default: 0 })
  day4: string | null;

  @Column("int", { name: "day5", nullable: false, default: 0 })
  day5: string | null;

  @Column("int", { name: "day6", nullable: false, default: 0 })
  day6: string | null;

  @Column("int", { name: "day7", nullable: false, default: 0 })
  day7: string | null;

  @Column("int", { name: "day8", nullable: false, default: 0 })
  day8: string | null;

  @Column("int", { name: "day9", nullable: false, default: 0 })
  day9: string | null;

  @Column("int", { name: "day10", nullable: false, default: 0 })
  day10: string | null;

  @Column("int", { name: "day11", nullable: false, default: 0 })
  day11: string | null;

  @Column("datetime", { name: "createddate", nullable: false, default: () => "CURRENT_TIMESTAMP"})
  createddate: string | null;

}
