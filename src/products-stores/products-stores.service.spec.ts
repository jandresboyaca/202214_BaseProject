/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { ProductService } from "../products/product.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";
import { ProductEntity } from "../products/product.entity";
import { ProductsStoresService } from "./products-stores.service";
import { StoreEntity } from "../stores/store.entity";
import { StoreService } from "../stores/store.service";

describe("ProductsStoresService", () => {
  let service: ProductsStoresService;
  let storeEntityRepository: Repository<StoreEntity>;
  let productRepository: Repository<ProductEntity>;
  let storeEntities: StoreEntity[];
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductsStoresService, StoreService, ProductService]
    }).compile();

    service = module.get<ProductsStoresService>(ProductsStoresService);

    storeEntityRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity)
    );

    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity)
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    storeEntityRepository.clear();
    productRepository.clear();
    storeEntities = [];
    productsList = [];

    for (let i = 0; i < 5; i++) {
      const storeEntity: StoreEntity = await storeEntityRepository.save({
        name: faker.name.fullName(),
        city: faker.address.country(),
        address: faker.address.streetAddress(),
        products: null
      });
      const product: ProductEntity = await productRepository.save({
        name: faker.name.fullName(),
        price: 123,
        type: faker.word.noun(),
        stores: null
      });
      productsList.push(product);
      storeEntities.push(storeEntity);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("add a product should return product with store associated", async () => {
    await service.addStoreToProduct(
      productsList[0].id,
      storeEntities[0].id
    );
    const storeEntity = await service.findStoreFromProduct(productsList[0].id, storeEntities[0].id);

    expect(storeEntity).toBeDefined();
  });

  it("add a invalid to valid store  should return  exception", async () => {
    await expect(() => service.addStoreToProduct(
      productsList[0].id,
      faker.datatype.uuid()
    )).rejects.toHaveProperty("message", "The store with the given id was not found");
  });


  it("add a valid store to invalid product should return  exception", async () => {
    await expect(() => service.addStoreToProduct(
      faker.datatype.uuid(),
      storeEntities[0].id
    )).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it("get a invalid store to valid product should return  exception", async () => {
    await expect(() => service.findStoreFromProduct(
      productsList[0].id,
      faker.datatype.uuid()
    )).rejects.toHaveProperty("message", "The store with the given id was not found in the product");
  });

  it("get a valid store to valid product should return value", async () => {
    await service.addStoreToProduct(
      productsList[0].id,
      storeEntities[0].id
    );
    const storeEntity = await service.findStoreFromProduct(productsList[0].id, storeEntities[0].id);
    expect(storeEntity.id).toEqual(storeEntities[0].id);
  });

});

