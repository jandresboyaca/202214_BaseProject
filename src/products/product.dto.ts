import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

enum TypeEnum {
  PERISHABLE,
  NONPERISHABLE,
}

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  readonly type: string;
}
