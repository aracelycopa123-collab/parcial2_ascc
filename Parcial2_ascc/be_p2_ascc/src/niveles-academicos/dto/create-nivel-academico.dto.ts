import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNivelAcademicoDto {
  @ApiProperty()
  @IsString({ message: 'El campo nombre debe estar definido' })
  @IsNotEmpty({ message: 'El nombre del nivel es obligatorio.' })
  @MaxLength(20, {
    message: 'El campo nombre no debe ser mayor a 20 caracteres',
  })
  readonly nombre: string;

  @ApiProperty()
  @IsString({ message: 'El campo nombre debe estar definido' })
  @IsOptional({ message: 'El campo descripcion es opcional' })
  @MaxLength(500, {
    message: 'El campo nombre no debe ser mayor a 500 caracteres',
  })
  readonly descripcion: string;
}
