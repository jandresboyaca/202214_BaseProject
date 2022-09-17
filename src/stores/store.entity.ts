import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "../products/product.entity";

@Entity()
export class StoreEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @ManyToMany(() => ProductEntity, (products) => products.stores)
  @JoinColumn()
  products: ProductEntity[];
}
