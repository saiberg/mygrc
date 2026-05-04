import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGrcRoleDto {
  @ApiProperty({ description: 'Unique role name in GRC format' })
  @IsNotEmpty()
  @IsString()
  role_name: string;

  @ApiPropertyOptional({ description: 'Description mapping to the business role' })
  @IsOptional()
  @IsString()
  role_desc?: string;

  @ApiPropertyOptional({ description: 'Business Area or Process it belongs to' })
  @IsOptional()
  @IsString()
  process_area?: string;

  @ApiProperty({ description: 'Risk Criticality Level', example: 'High' })
  @IsNotEmpty()
  @IsString()
  criticality: string;

  @ApiPropertyOptional({ description: 'Status' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
