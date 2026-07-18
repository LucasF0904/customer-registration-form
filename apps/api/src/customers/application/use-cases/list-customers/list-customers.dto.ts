import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class ListCustomersDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10

  @ApiPropertyOptional({ description: 'Busca por nome, CPF ou e-mail' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: 'Filtrar por cor preferida (UUID)' })
  @IsOptional()
  @IsUUID()
  colorId?: string
}
