import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("settings", { schema: "flood1800" })
export class Settings {
  @PrimaryGeneratedColumn({ type: "int", name: "settingid" })
  settingid: string;

  @Column("varchar", { name: "name", nullable: true, length: 200 })
  name: string | null;

  @Column("decimal", {
    name: "value",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'"
  })
  value: string | null;

  @Column("int", {
    name: "order",
    default: () => "1"
  })
  order: string | null;

}
