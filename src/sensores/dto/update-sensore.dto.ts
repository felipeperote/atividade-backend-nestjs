import { CreateSensoreDto } from './create-sensore.dto';

export class UpdateSensoreDto extends CreateSensoreDto {
  ativo: boolean;
}