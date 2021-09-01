import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("image", { schema: "flood1800" })
export class Image {
  @PrimaryGeneratedColumn({ type: "int", name: "imageid" })
  imageid: number;

  @Column("int", { name: "jobid", nullable: true })
  jobid: number | null;

  @Column("int", { name: "areaid", nullable: true })
  areaid: number | null;

  @Column("varchar", {
    name: "name",
    nullable: false,
    length: 200
  })
  name: string | null;

  @Column("varchar", {
    name: "location",
    nullable: false,
    length: 400
  })
  location: string | null;
  
}
