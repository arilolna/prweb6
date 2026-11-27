import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryMedicinesDto {
  // ?limit=5 приходить рядком "5"; @Type + transform:true перетворюють його на число
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1)
  @Max(100)
  readonly limit?: number;
}
