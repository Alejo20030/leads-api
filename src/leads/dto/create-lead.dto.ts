import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, MinLength, IsNumber } from 'class-validator';

export enum LeadSource {
  instagram = 'instagram',
  facebook = 'facebook',
  landing_page = 'landing_page',
  referido = 'referido',
  otro = 'otro',
}

export class CreateLeadDto {
  @ApiProperty({ example: 'Juan Perez' })
  @MinLength(2)
  nombre: string;

  @ApiProperty({ example: 'juan@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  telefono?: string;

  @ApiProperty({ enum: LeadSource })
  @IsEnum(LeadSource)
  fuente: LeadSource;

  @ApiProperty({ required: false })
  @IsOptional()
  producto_interes?: string;

  @ApiProperty({ required: false, example: 100 })
  @IsOptional()
  @IsNumber()
  presupuesto?: number;
}