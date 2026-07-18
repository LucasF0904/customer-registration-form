import 'reflect-metadata'
import { createConnection } from 'net'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter'
import { ResponseInterceptor } from './shared/interceptors/response.interceptor'

async function waitForDatabase(): Promise<void> {
  const host = process.env.DB_HOST ?? 'localhost'
  const port = parseInt(process.env.DB_PORT ?? '5432', 10)
  console.log(`[STARTUP] Waiting for DB at ${host}:${port}`)
  let attempt = 0
  while (true) {
    const reachable = await new Promise<boolean>((resolve) => {
      const socket = createConnection({ host, port })
      socket.setTimeout(5000)
      socket.once('connect', () => {
        socket.destroy()
        resolve(true)
      })
      socket.once('error', () => {
        socket.destroy()
        resolve(false)
      })
      socket.once('timeout', () => {
        socket.destroy()
        resolve(false)
      })
    })
    if (reachable) {
      console.log(`[STARTUP] DB reachable after ${attempt} attempts`)
      return
    }
    attempt++
    console.log(`[STARTUP] DB not reachable (attempt ${attempt}), retrying in 3s...`)
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}

async function bootstrap() {
  console.log(
    `[STARTUP] DB_HOST=${process.env.DB_HOST} DB_PORT=${process.env.DB_PORT} DB_NAME=${process.env.DB_NAME} NODE_ENV=${process.env.NODE_ENV}`,
  )
  await waitForDatabase()
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  })

  app.useLogger(app.get(Logger))

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  })

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Customer Registration API')
      .setDescription('API para cadastro único de clientes com validação de CPF e cor preferida.')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' })
      .addTag('auth', 'Autenticação de administrador')
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

bootstrap().catch((err) => {
  console.error('FATAL:', err?.message ?? err)
  console.error(err?.stack)
  process.exit(1)
})
