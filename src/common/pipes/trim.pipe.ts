import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Санітизація вхідних даних: прибирає пробіли на початку й у кінці
 * всіх рядків (рекурсивно для об'єктів та масивів).
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    // Власні декоратори (@Req тощо) не чіпаємо
    if (metadata.type === 'custom') {
      return value;
    }
    return this.trim(value);
  }

  private trim(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.trim(item));
    }
    if (value !== null && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        obj[key] = this.trim(obj[key]);
      }
      return obj;
    }
    return value;
  }
}
