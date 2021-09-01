import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user", { schema: "flood1800" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "userid" })
  userid: number;

  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 100 })
  password: string | null;

  @Column("varchar", { name: "firstname", nullable: true, length: 100 })
  firstname: string | null;

  @Column("varchar", { name: "lastname", nullable: true, length: 100 })
  lastname: string | null;

  @Column("varchar", { name: "mobile", nullable: true, length: 15 })
  mobile: string | null;

  @Column("varchar", { name: "verificationcode", nullable: true, length: 6 })
  verificationcode: string | null;

  @Column("bit", { name: "isactive", nullable: true, default: () => "b'0'" })
  isactive: boolean | null;

  @Column("bit", { name: "isadmin", nullable: true, default: () => "'b'0''" })
  isadmin: boolean | null;

  @Column("int", { name: "customerid", nullable: true })
  customerid: number | null;
}
