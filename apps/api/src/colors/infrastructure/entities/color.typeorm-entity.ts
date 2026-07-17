import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity('colors')
export class ColorTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string

  @Column({ type: 'varchar', length: 7, name: 'hex_code' })
  hexCode!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
