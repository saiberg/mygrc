import { Controller, Get, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RiskMatrixService } from './risk-matrix.service';
import { CreateRiskRuleDto } from './dto/create-risk-rule.dto';

@ApiTags('Risk Matrix / Rules')
@Controller('risk-matrix')
export class RiskMatrixController {
  constructor(private readonly riskMatrixService: RiskMatrixService) {}

  @ApiOperation({ summary: 'List all GRC Risk Rules with their items' })
  @Get('rules')
  getRules() {
    return this.riskMatrixService.getRules();
  }

  @ApiOperation({ summary: 'Get a specific rule by ID' })
  @Get('rules/:id')
  getRuleById(@Param('id') id: string) {
    return this.riskMatrixService.getRuleById(id);
  }

  @ApiOperation({ summary: 'Create a new Risk Rule (with optional items)' })
  @Post('rules')
  createRule(@Body() dto: CreateRiskRuleDto) {
    return this.riskMatrixService.createRule(dto);
  }

  @ApiOperation({ summary: 'Toggle active/inactive status of a rule' })
  @Patch('rules/:id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.riskMatrixService.toggleActive(id);
  }

  @ApiOperation({ summary: 'Delete a Risk Rule and its items' })
  @Delete('rules/:id')
  deleteRule(@Param('id') id: string) {
    return this.riskMatrixService.deleteRule(id);
  }
}
