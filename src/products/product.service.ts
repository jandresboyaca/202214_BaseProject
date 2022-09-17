/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BusinessError, BusinessLogicException } from "../shared/errors/business-errors";
import { ProductEntity } from "./product.entity";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsEntityRepository: Repository<ProductEntity>
  ) {
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productsEntityRepository.find({});
  }

  async findOne(id: string, withStores = false): Promise<ProductEntity> {
    let options: FindOneOptions = { where: { id } };
    options = withStores ? { ...options, ...{ relations: ["stores"] } } : options;
    const product: ProductEntity = await this.productsEntityRepository.findOne(options);
    if (!product)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND
      );

    return product;
  }

  async create(productEntity: ProductEntity): Promise<ProductEntity> {
    return await this.productsEntityRepository.save(productEntity);
  }

  async update(
    id: string,
    productEntity: ProductEntity
  ): Promise<ProductEntity> {
    const oldProduct: ProductEntity =
      await this.productsEntityRepository.findOne({ where: { id } });
    if (!oldProduct)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

    Object.assign(oldProduct, productEntity);

    return await this.productsEntityRepository.save(oldProduct);
  }

  async delete(id: string) {
    const productsEntity: ProductEntity =
      await this.productsEntityRepository.findOne({ where: { id } });
    if (!productsEntity)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

    await this.productsEntityRepository.remove(productsEntity);
  }
}
