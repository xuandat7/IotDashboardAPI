import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors()
  );


  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('ESP8266 API')
    .setDescription('API điều khiển đèn, quạt và nhận dữ liệu cảm biến')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
