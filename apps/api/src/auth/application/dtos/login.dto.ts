import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'JohnDoe@mail.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty()
  email!: string

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty()
  password!: string
}
