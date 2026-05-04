import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGrcUserDto {
  @ApiProperty({ description: 'The unique identification code of the user from the external system (e.g., SAP ID)' })
  @IsNotEmpty()
  @IsString()
  user_code: string;

  @ApiProperty({ description: 'The full name of the user' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiPropertyOptional({ description: 'The associated email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'The originating source system' })
  @IsOptional()
  @IsString()
  source_system?: string;

  @ApiPropertyOptional({ description: 'Status of the user' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
