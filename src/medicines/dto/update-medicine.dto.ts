import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineDto } from './create-medicine.dto';

// PartialType копіює всі валідатори CreateMedicineDto
// і додає до кожного поля @IsOptional()
export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {}
