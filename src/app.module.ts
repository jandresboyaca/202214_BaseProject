import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './stores/store.module';
import { ProductModule } from './products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';
import { StoreEntity } from './stores/store.entity';
import { ProductsStoresModule } from './products-stores/products-stores.module';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    ProductsStoresModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [ProductEntity, StoreEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
