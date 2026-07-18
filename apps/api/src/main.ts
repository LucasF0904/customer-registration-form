import 'reflect-metadata'
import { createConnection } from 'net'
import { lookup } from 'dns'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter'
import { ResponseInterceptor } from './shared/interceptors/response.interceptor'

const NTFY_TOPIC = 'eteg-api-diag-f7x2k9'

async function push(msg: string): Promise<void> {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: msg,
      headers: { 'Content-Type': 'text/plain', 'X-Title': 'eteg-api-dev' },
    })
  } catch {
    // best-effort, never crash on push failure
  }
}

async function dnsLookup(host: string): Promise<string> {
  return new Promise((resolve) => {
    lookup(host, (err, address) => {
      if (err) resolve(`DNS_ERR:${err.code}`)
      else resolve(address)
    })
  })
}

async function tcpCheck(host: string, port: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
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
}

async function waitForDatabase(): Promise<void> {
  const host = process.env.DB_HOST ?? 'localhost'
  const port = parseInt(process.env.DB_PORT ?? '5432', 10)

  const dnsResult = await dnsLookup(host)
  await push(
    `[1] DB_HOST=${host} DNS=${dnsResult} DB_PORT=${port} DB_NAME=${process.env.DB_NAME} NODE_ENV=${process.env.NODE_ENV}`,
  )
  console.log(`[STARTUP] DNS ${host} → ${dnsResult}`)

  let attempt = 0
  while (true) {
    const reachable = await tcpCheck(host, port)
    if (reachable) {
      const msg = `[2] TCP OK after ${attempt} attempts`
      console.log(`[STARTUP] ${msg}`)
      await push(msg)
      return
    }
    attempt++
    const msg = `[2] TCP FAIL attempt=${attempt}`
    console.log(`[STARTUP] ${msg}`)
    if (attempt <= 3) await push(msg)
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}

async function bootstrap() {
  await push(`[0] CONTAINER STARTED NODE_ENV=${process.env.NODE_ENV}`)
  console.log(
    `[STARTUP] DB_HOST=${process.env.DB_HOST} DB_PORT=${process.env.DB_PORT} DB_NAME=${process.env.DB_NAME} NODE_ENV=${process.env.NODE_ENV}`,
  )

  try {
    await waitForDatabase()
  } catch (e) {
    await push(`[ERR] waitForDatabase threw: ${e}`)
    throw e
  }

  await push('[3] Starting NestJS...')
  console.log('[STARTUP] Starting NestJS...')

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
  await push(`[4] NestJS listening on port ${port}`)
}

bootstrap().catch(async (err) => {
  const msg = `[FATAL] ${err?.message ?? err}`
  console.error(msg)
  console.error(err?.stack)
  await push(msg)
  await push(`[STACK] ${err?.stack?.slice(0, 500) ?? 'no stack'}`)
  process.exit(1)
})
