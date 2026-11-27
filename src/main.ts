import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { TrimPipe } from './common/pipes/trim.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Порядок важливий: спочатку TrimPipe (санітизація), потім ValidationPipe
  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TimingInterceptor());

  await app.listen(3000);
}
bootstrap();
