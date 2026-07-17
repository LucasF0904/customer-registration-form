import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator'

export class RegisterCustomerDto {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'Maria Oliveira',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  @MaxLength(255)
  name!: string

  @ApiProperty({
    description: 'CPF do cliente (com ou sem formatação)',
    example: '123.456.789-09',
  })
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @IsString()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, { message: 'Formato de CPF inválido' })
  cpf!: string

  @ApiProperty({
    description: 'Endereço de e-mail do cliente',
    example: 'maria@exemplo.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @ApiProperty({
    description: 'ID da cor preferida (UUID da tabela colors)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'A cor preferida é obrigatória' })
  @IsUUID('4', { message: 'O ID da cor deve ser um UUID válido' })
  colorId!: string

  @ApiPropertyOptional({
    description: 'Observações adicionais',
    example: 'Cliente VIP, contato preferencial por e-mail.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string
}
