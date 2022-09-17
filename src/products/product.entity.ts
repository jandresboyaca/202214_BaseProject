import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { StoreEntity } from "../stores/store.entity";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  type: string;

  @ManyToMany(() => StoreEntity, (stores) => stores.products)
  @JoinTable()
  stores: StoreEntity[];
}
