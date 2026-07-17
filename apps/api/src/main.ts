import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  })

  app.useLogger(app.get(Logger))

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  })

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Customer Registration API')
      .setDescription('API para cadastro único de clientes com validação de CPF e cor preferida.')
      .setVersion('1.0')
      .addTag('customers', 'Operações de cadastro de clientes')
      .addTag('colors', 'Cores disponíveis para seleção')
      .addTag('health', 'Monitoramento da aplicação')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    })
  }

  const port = process.env.PORT ?? 3001
  await app.listen(port, '0.0.0.0')
}

bootstrap()
