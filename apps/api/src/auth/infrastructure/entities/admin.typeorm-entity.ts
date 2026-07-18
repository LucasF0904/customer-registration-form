import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity('admins')
export class AdminTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
