import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { ColorTypeOrmEntity } from '../../../colors/infrastructure/entities/color.typeorm-entity'

@Entity('customers')
export class CustomerTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 11 })
  cpf!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ type: 'uuid', name: 'color_id' })
  colorId!: string

  @ManyToOne(() => ColorTypeOrmEntity, { eager: true })
  @JoinColumn({ name: 'color_id' })
  color!: ColorTypeOrmEntity

  @Column({ type: 'text', nullable: true })
  notes?: string

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
