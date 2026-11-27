import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { QueryMedicinesDto } from './dto/query-medicines.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicinesService } from './medicines.service';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  create(@Body() dto: CreateMedicineDto) {
    return this.medicinesService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryMedicinesDto) {
    return this.medicinesService.findAll(query.limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicineDto) {
    return this.medicinesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.medicinesService.remove(id);
  }
}
