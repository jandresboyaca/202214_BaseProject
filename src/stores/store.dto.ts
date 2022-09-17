import { IsNotEmpty, IsString, Length } from 'class-validator';

export class StoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  city: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
