import { IsNotEmpty, IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ description: 'Internal UUID of the User' })
  @IsNotEmpty()
  @IsString()
  id_user: string;

  @ApiProperty({ description: 'Internal UUID of the Role' })
  @IsNotEmpty()
  @IsString()
  id_role: string;

  @ApiPropertyOptional({ description: 'Date when the assignment was made' })
  @IsOptional()
  @IsDateString()
  assigned_at?: string;

  @ApiPropertyOptional({ description: 'Date when the assignment starts being active' })
  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @ApiPropertyOptional({ description: 'End date of the assignment, if any' })
  @IsOptional()
  @IsDateString()
  valid_to?: string;

  @ApiPropertyOptional({ description: 'Whether the assignment is active' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
