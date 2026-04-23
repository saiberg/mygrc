import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalysisRunDto {
  @ApiProperty({ description: 'Name or label for this analysis run', example: 'Q1 2025 Full Audit' })
  @IsNotEmpty()
  @IsString()
  run_name: string;

  @ApiProperty({ description: 'Scope type', example: 'All Users' })
  @IsNotEmpty()
  @IsString()
  scope_type: string;

  @ApiProperty({ description: 'Scope value (e.g. department, user list)', example: 'Finance' })
  @IsNotEmpty()
  @IsString()
  scope_value: string;

  @ApiPropertyOptional({ description: 'User or system executing the run', example: 'admin@company.com' })
  @IsOptional()
  @IsString()
  executed_by?: string;
}
