/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { BusinessErrorsInterceptor } from "../shared/interceptors/business-errors.interceptor";
import { ProductEntity } from "./product.entity";
import { plainToInstance } from "class-transformer";
import { ProductService } from "./product.service";
import { ProductDto } from "./product.dto";

@UseInterceptors(BusinessErrorsInterceptor)
@Controller("products")
export class ProductController {

  constructor(private readonly productService: ProductService) {
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(":productID")
  async findOne(@Param("productID") productID: string) {
    return await this.productService.findOne(productID);
  }

  @Post()
  async create(@Body() productDto: ProductDto) {
    const pro: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.create(pro);
  }

  @Put(":productID")
  async update(@Param("productID") productID: string, @Body() productDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.update(productID, product);
  }

  @Delete(":productID")
  @HttpCode(204)
  async delete(@Param("productID") productID: string) {
    return await this.productService.delete(productID);
  }
}

