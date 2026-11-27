import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpLoggingMiddleware } from './common/middleware/http-logger.middleware';
import { MedicinesModule } from './medicines/medicines.module';

@Module({
  imports: [MedicinesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggingMiddleware).forRoutes('*');
  }
}
