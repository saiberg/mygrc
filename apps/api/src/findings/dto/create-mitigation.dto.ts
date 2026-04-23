import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMitigationDto {
  @ApiProperty({ description: 'Name of the responsible owner for this mitigation' })
  @IsNotEmpty()
  @IsString()
  owner_name: string;

  @ApiPropertyOptional({ description: 'Comments or justification' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'Date until which the mitigation is valid' })
  @IsOptional()
  @IsDateString()
  valid_until?: string;
}
