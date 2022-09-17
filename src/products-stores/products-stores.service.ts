/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ProductService } from "../products/product.service";
import { ProductEntity } from "../products/product.entity";
import { BusinessError, BusinessLogicException } from "../shared/errors/business-errors";
import { StoreService } from "../stores/store.service";
import { StoreEntity } from "../stores/store.entity";

@Injectable()
export class ProductsStoresService {
  constructor(
    private readonly storeService: StoreService,
    private readonly productService: ProductService
  ) {
  }

  async addStoreToProduct(productId: string, storeId: string): Promise<ProductEntity> {
    const store: StoreEntity = await this.storeService.findOne(storeId);
    const product: ProductEntity = await this.productService.findOne(productId);

    product.stores = product.stores
      ? [...product.stores, store]
      : [store];

    return await this.productService.update(product.id, product);
  }

  async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
    const product: ProductEntity = await this.productService.findOne(productId, true);
    return product.stores;
  }

  async findStoreFromProduct(productId: string, storeId: string): Promise<StoreEntity> {
    const product: ProductEntity = await this.productService.findOne(productId , true);
    const storeEntity = product.stores.find((store) => (store.id == storeId));
    if (!storeEntity)
      throw new BusinessLogicException("The store with the given id was not found in the product", BusinessError.NOT_FOUND);
    return storeEntity;
  }

  async updateStoresFromProduct(productId: string, storesId: string[]): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId, true);
    product.stores = product.stores.filter(store => {
      return storesId.includes(store.id);
    });

    for (const id of storesId) {
      const newStore = await this.storeService.findOne(id);
      product.stores = product.stores
        ? [...product.stores, newStore]
        : [newStore];}
    return await this.productService.update(productId, product);
  }

  async deleteStoresFromProduct(productId: string, storeId: string) {
    const product: ProductEntity = await this.productService.findOne(productId, true);
    await this.storeService.findOne(storeId);
    product.stores = product.stores.filter(store => {
      return store.id != storeId;
    });
    await this.productService.update(productId, product);
  }
}
