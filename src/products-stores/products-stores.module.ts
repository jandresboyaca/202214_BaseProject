import { Module } from '@nestjs/common';
import { ProductModule } from '../products/product.module';
import { StoreModule } from '../stores/store.module';
import { ProductsStoresService } from './products-stores.service';
import { ProductsStoresController } from './products-stores.controller';

@Module({
  imports: [ProductModule, StoreModule],
  providers: [ProductsStoresService],
  controllers: [ProductsStoresController],
})
export class ProductsStoresModule {}
