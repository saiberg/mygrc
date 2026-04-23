import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';
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

  @ApiProperty({ description: 'Date when the assignment starts being active' })
  @IsNotEmpty()
  @IsDateString()
  valid_from: string;

  @ApiPropertyOptional({ description: 'End date of the assignment, if any' })
  @IsOptional()
  @IsDateString()
  valid_to?: string;
}
