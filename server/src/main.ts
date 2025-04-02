import { NestFactory } from '@nestjs/core';
import { patchNestJsSwagger } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';

patchNestJsSwagger();
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(
  //     path.join(__dirname, '../certificates/localhost-key.pem'),
  //   ),
  //   cert: fs.readFileSync(
  //     path.join(__dirname, '../certificates/localhost.pem'),
  //   ),
  // };
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 7500);
}
bootstrap();
