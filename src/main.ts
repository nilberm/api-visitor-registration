import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Documentation with Swagger - Museum Api')
    .setDescription(
      'Swagger (aka OpenApi) is a very well-known library in the backend universe, being available for different languages and frameworks. It generates an internal website on your backend that describes, in great detail, each endpoint and entity structure present in your application.',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('visitor')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
