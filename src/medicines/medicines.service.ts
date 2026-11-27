import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine } from './entities/medicine.entity';

@Injectable()
export class MedicinesService {
  private medicines: Medicine[] = [];
  private nextId = 1;

  findAll(limit?: number): Medicine[] {
    return limit ? this.medicines.slice(0, limit) : this.medicines;
  }

  findOne(id: number): Medicine {
    const medicine = this.medicines.find((m) => m.id === id);
    if (!medicine) {
      throw new NotFoundException(`Ліки з id=${id} не знайдено`);
    }
    return medicine;
  }

  create(dto: CreateMedicineDto): Medicine {
    const medicine: Medicine = { id: this.nextId++, ...dto };
    this.medicines.push(medicine);
    return medicine;
  }

  update(id: number, dto: UpdateMedicineDto): Medicine {
    const medicine = this.findOne(id);
    Object.assign(medicine, dto);
    return medicine;
  }

  remove(id: number): void {
    const medicine = this.findOne(id);
    this.medicines = this.medicines.filter((m) => m.id !== medicine.id);
  }
}
