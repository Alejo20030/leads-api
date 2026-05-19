import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Lead } from './leads/schemas/lead.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const leadModel = app.get(getModelToken(Lead.name));

  await leadModel.deleteMany({});

  await leadModel.insertMany([
    {
      nombre: 'Juan Perez',
      email: 'juan1@test.com',
      fuente: 'instagram',
      presupuesto: 100,
    },
    {
      nombre: 'Maria Lopez',
      email: 'maria@test.com',
      fuente: 'facebook',
      presupuesto: 200,
    },
    {
      nombre: 'Carlos Diaz',
      email: 'carlos@test.com',
      fuente: 'landing_page',
      presupuesto: 150,
    },
  ]);

  console.log('Seed ejecutado correctamente');
  await app.close();
}

bootstrap();