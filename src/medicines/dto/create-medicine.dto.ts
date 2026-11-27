import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMedicineDto {
  @IsString({ message: 'title має бути рядком' })
  @IsNotEmpty({ message: 'title є обов\'язковим' })
  @MinLength(2, { message: 'title має містити щонайменше 2 символи' })
  @MaxLength(100, { message: 'title має містити не більше 100 символів' })
  readonly title: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price must be a number (max 2 decimals)' })
  @IsPositive({ message: 'price must be a positive number' })
  readonly price: number;

  @IsNumber({}, { message: 'dosageMg must be a number' })
  @IsPositive({ message: 'dosageMg must be a positive number' })
  readonly dosageMg: number;

  @IsBoolean({ message: 'isPrescriptionRequired must be a boolean value' })
  readonly isPrescriptionRequired: boolean;

  @IsDateString({}, { message: 'expirationDate must be a valid ISO 8601 date string' })
  readonly expirationDate: string;
}
