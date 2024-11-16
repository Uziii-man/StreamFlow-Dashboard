import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000);
  console.log('backend is runnung in port 3000')

}
bootstrap();
