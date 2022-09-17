
import { IsNotEmpty, IsString } from "class-validator";

export class StoresDto {

  @IsString()
  @IsNotEmpty()
  readonly id: string;

}
