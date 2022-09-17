/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";

import { faker } from "@faker-js/faker";
import { ProductService } from "./product.service";
import { ProductEntity } from "./product.entity";
import { StoreEntity } from "../stores/store.entity";

describe("ProductService", () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let storeEntityRepository: Repository<StoreEntity>;
  let productsEntities: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService]
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity)
    );
    storeEntityRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity)
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    storeEntityRepository.clear();
    productsEntities = [];
    for (let i = 0; i < 5; i++) {
      const productEntity: ProductEntity = await repository.save({
        name: faker.name.fullName(),
        price: 123,
        type: faker.lorem.sentence()
      });
      productsEntities.push(productEntity);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("findAll should return all products", async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsEntities.length);
  });

  it("findOne should return a product by id", async () => {
    const oldProduct: ProductEntity = productsEntities[0];
    const product: ProductEntity = await service.findOne(oldProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(oldProduct.name);
    expect(product.price).toEqual(oldProduct.price);
    expect(product.type).toEqual(oldProduct.type);
  });

  it("findOne should throw an exception for an invalid product", async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The product with the given id was not found"
    );
  });

  it("create should return a new product", async () => {
    const product: ProductEntity = {
      id: "",
      name: faker.name.fullName(),
      price: 456,
      type: faker.lorem.word(),
      stores: null
    };

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: newProduct.id }
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name);
    expect(storedProduct.price).toEqual(newProduct.price);
    expect(storedProduct.type).toEqual(newProduct.type);
  });

  it("update should modify a product", async () => {
    const product: ProductEntity = productsEntities[0];
    product.name = "New name";
    product.type = "New type";
    product.price = 789;

    const updatedProduct: ProductEntity = await service.update(
      product.id,
      product
    );
    expect(updatedProduct).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id }
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name);
    expect(storedProduct.price).toEqual(product.price);
    expect(storedProduct.type).toEqual(product.type);
  });

  it("update should throw an exception for an invalid product", async () => {
    const product: ProductEntity = productsEntities[0];
    product.name = "New name";
    product.type = "New type";
    product.price = 456;

    await expect(() => service.update("0", product)).rejects.toHaveProperty(
      "message",
      "The product with the given id was not found"
    );
  });

  it("delete should remove a product", async () => {
    const product: ProductEntity = productsEntities[0];
    await service.delete(product.id);

    const deletedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id }
    });
    expect(deletedProduct).toBeNull();
  });

  it("delete should throw an exception for an invalid product", async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The product with the given id was not found"
    );
  });
});

