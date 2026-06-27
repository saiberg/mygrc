import { NestFactory } from '@nestjs/core';
import * as os from 'os';
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
    origin: [
      'http://localhost:5173',
      'http://100.96.122.41:5173',
      'http://100.96.122.42:5173',
      'http://laptop-lur3k0l3.tailae45b6.ts.net:5173',
      'https://portal-production-9dec.up.railway.app',
    ],
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
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  // Get local network IP for convenience
  const nets = os.networkInterfaces();
  const localIp = Object.values(nets)
    .flat()
    .find((n) => n?.family === 'IPv4' && !n.internal)?.address ?? 'localhost';

  console.log(`\n🚀  API running at:`);
  console.log(`   Local:   http://localhost:${port}/api`);
  console.log(`   Network: http://${localIp}:${port}/api`);
  console.log(`📚  Swagger Docs: http://${localIp}:${port}/api/docs`);
}
bootstrap();
