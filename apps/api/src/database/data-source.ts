import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { CustomerTypeOrmEntity } from '../customers/infrastructure/entities/customer.typeorm-entity'
import { ColorTypeOrmEntity } from '../colors/infrastructure/entities/color.typeorm-entity'
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'customer_registration',
  entities: [CustomerTypeOrmEntity, ColorTypeOrmEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
})
