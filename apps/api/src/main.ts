import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { json } from 'express';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  // Winston Logger setup
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Security headers
  app.use(helmet());

  // Allow larger payloads
  app.use(json({ limit: '50mb' }));

  // CORS configuration
  app.enableCors({
    origin: '*', // Customize this as needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger OpenAPI Documentation Configuration
  const config = new DocumentBuilder()
    .setTitle('myGRC API')
    .setDescription('The myGRC API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n🚀  API running at http://localhost:${port}/api`);
  console.log(`📚  Swagger Docs running at http://localhost:${port}/api/docs`);
}
bootstrap();
