import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origin = config.get<string>('FRONTEND_ORIGIN') || 'http://localhost:3000';
  app.enableCors({
    origin,
    credentials: true,
  });

  const port = Number(config.get('PORT') || 3001);
  await app.listen(port);
  console.log(`DilYum API listening on http://localhost:${port}/api/v1`);
}
bootstrap();
