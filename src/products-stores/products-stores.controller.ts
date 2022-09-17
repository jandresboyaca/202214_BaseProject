/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { BusinessErrorsInterceptor } from "../shared/interceptors/business-errors.interceptor";
import { ProductsStoresService } from "./products-stores.service";
import { StoresDto } from "./stores.dto";

@UseInterceptors(BusinessErrorsInterceptor)
@Controller("products")
export class ProductsStoresController {
  constructor(private readonly productsStoresService: ProductsStoresService) {
  }

  @Post(":productId/stores/:storeId")
  async addStoreToProduct(@Param("productId") productId: string, @Param("storeId") storeId: string) {
    return await this.productsStoresService.addStoreToProduct(productId, storeId);
  }

  @Get(":productId/stores")
  async findStoreFromProduct(@Param("productId") productId: string) {
    return await this.productsStoresService.findStoresFromProduct(productId);
  }

  @Get(":productId/stores/:storeId")
  async findStoresFromProduct(@Param("productId") productId: string, @Param("storeId") storeId: string) {
    return await this.productsStoresService.findStoreFromProduct(productId, storeId);
  }

  @Put(":productId/stores")
  async updateStoresFromProduct(@Param("productId") productId: string, @Body() storesDtos: StoresDto[]) {
    const storesId = storesDtos.map(store => store.id);
    return await this.productsStoresService.updateStoresFromProduct(productId, storesId);
  }

  @Delete(":productId/stores/:storeId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStoresFromProduct(@Param("productId") productId: string, @Param("storeId") storeId: string) {
    return await this.productsStoresService.deleteStoresFromProduct(productId, storeId);
  }

}

