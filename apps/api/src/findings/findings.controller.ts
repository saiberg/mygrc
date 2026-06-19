import { Controller, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FindingsService } from './findings.service';
import { CreateMitigationDto } from './dto/create-mitigation.dto';

@ApiTags('Findings & Mitigations')
@Controller('findings')
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @ApiOperation({ summary: 'Summary KPIs for findings' })
  @Get('summary')
  getSummary() {
    return this.findingsService.getFindingSummary();
  }

  @ApiOperation({ summary: 'List findings with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by finding_status' })
  @ApiQuery({ name: 'risk_level', required: false, description: 'Filter by risk_level' })
  @ApiQuery({ name: 'run_name', required: false, description: 'Filter by analysis run name' })
  @Get()
  getFindings(
    @Query('status') status?: string,
    @Query('risk_level') risk_level?: string,
    @Query('run_name') run_name?: string,
  ) {
    return this.findingsService.getFindings(status, risk_level, run_name);
  }

  @ApiOperation({ summary: 'Get a single finding detail' })
  @Get(':id')
  getFinding(@Param('id') id: string) {
    return this.findingsService.getFindingById(id);
  }

  @ApiOperation({ summary: 'Update the status of a finding' })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.findingsService.updateStatus(id, body.status);
  }

  @ApiOperation({ summary: 'Submit or update a mitigation for a finding' })
  @Post(':id/mitigate')
  addMitigation(@Param('id') id: string, @Body() dto: CreateMitigationDto) {
    return this.findingsService.addMitigation(id, dto);
  }
}
