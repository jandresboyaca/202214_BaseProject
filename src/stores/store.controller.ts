/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BusinessErrorsInterceptor } from "../shared/interceptors/business-errors.interceptor";
import { StoreDto } from "./store.dto";
import { StoreEntity } from "./store.entity";
import { StoreService } from "./store.service";

@UseInterceptors(BusinessErrorsInterceptor)
@Controller("stores")
export class StoreController {

  constructor(private readonly storeService: StoreService) {
  }

  @Get()
  async findAll() {
    return await this.storeService.findAll();
  }

  @Get(":storeId")
  async findOne(@Param("storeId") storeId: string) {
    return await this.storeService.findOne(storeId);
  }

  @Post()
  async create(@Body() storeDto: StoreDto) {
    return await this.storeService.create(plainToInstance(StoreEntity, storeDto));
  }

  @Put(":storeId")
  async update(@Param("storeId") storeId: string, @Body() storeDto: StoreDto) {
    return await this.storeService.update(storeId, plainToInstance(StoreEntity, storeDto));
  }

  @Delete(":storeId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("storeId") storeId: string) {
    return await this.storeService.delete(storeId);
  }
}


