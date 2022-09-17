import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../products/product.entity';
import { StoreEntity } from '../../stores/store.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductEntity, StoreEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductEntity, StoreEntity]),
];
