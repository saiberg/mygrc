import { IsNotEmpty, IsOptional, IsString, IsBoolean, ValidateNested, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRuleItemDto {
  @ApiProperty({ description: 'Object type e.g. Tcode, AuthObject', example: 'Tcode' })
  @IsNotEmpty()
  @IsString()
  object_type: string;

  @ApiProperty({ description: 'Object value e.g. FB50, VA01', example: 'FB50' })
  @IsNotEmpty()
  @IsString()
  object_value: string;

  @ApiProperty({ description: 'Sequence number', example: 1 })
  @IsInt()
  @Min(1)
  seq_no: number;
}

export class CreateRiskRuleDto {
  @ApiProperty({ description: 'Unique rule code', example: 'SOD-001' })
  @IsNotEmpty()
  @IsString()
  rule_code: string;

  @ApiProperty({ description: 'Descriptive rule name', example: 'Create and Post Vendor Invoice' })
  @IsNotEmpty()
  @IsString()
  rule_name: string;

  @ApiProperty({ description: 'Rule type', example: 'Segregation of Duties' })
  @IsNotEmpty()
  @IsString()
  rule_type: string;

  @ApiProperty({ description: 'Risk level', example: 'High' })
  @IsNotEmpty()
  @IsString()
  risk_level: string;

  @ApiPropertyOptional({ description: 'Full description of the risk' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Recommended mitigation text' })
  @IsOptional()
  @IsString()
  mitigation_text?: string;

  @ApiPropertyOptional({ description: 'Whether this rule is active' })
  @IsOptional()
  @IsBoolean()
  active_flag?: boolean;

  @ApiPropertyOptional({ description: 'Rule items/objects that define this rule', type: [CreateRuleItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRuleItemDto)
  items?: CreateRuleItemDto[];
}
