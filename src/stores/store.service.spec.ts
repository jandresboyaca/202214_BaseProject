import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreService } from './store.service';
import { StoreEntity } from './store.entity';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storeEntities: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    storeEntities = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        name: faker.name.fullName(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        products: null,
      });
      storeEntities.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storeEntities.length);
  });

  it('findOne should return a store by id', async () => {
    const storeEntity: StoreEntity = storeEntities[0];
    const store: StoreEntity = await service.findOne(storeEntity.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storeEntity.name);
    expect(store.city).toEqual(storeEntity.city);
    expect(store.address).toEqual(storeEntity.address);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: '',
      name: faker.name.fullName(),
      city: faker.address.city(),
      address: faker.address.streetAddress(),
      products: [],
    };

    const newStore: StoreEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: newStore.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newStore.name);
    expect(storedStore.address).toEqual(newStore.address);
    expect(storedStore.city).toEqual(newStore.city);
  });

  it('update should modify a store', async () => {
    const store: StoreEntity = storeEntities[0];
    store.name = 'New name';
    store.city = 'New city';
    store.address = 'New address';

    const updatedStore: StoreEntity = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(store.name);
    expect(storedStore.city).toEqual(store.city);
    expect(storedStore.address).toEqual(store.address);
  });

  it('update should throw an exception for an invalid store', async () => {
    const store: StoreEntity = storeEntities[0];
    store.name = 'New name';
    store.city = 'New city';
    store.address = 'New address';

    await expect(() => service.update('0', store)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storeEntities[0];
    await service.delete(store.id);

    const deletedstore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(deletedstore).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});
