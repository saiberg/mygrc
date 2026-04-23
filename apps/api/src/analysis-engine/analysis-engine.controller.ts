import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalysisEngineService } from './analysis-engine.service';
import { CreateAnalysisRunDto } from './dto/create-analysis-run.dto';

@ApiTags('Analysis Engine / Runs')
@Controller('analysis-engine')
export class AnalysisEngineController {
  constructor(private readonly analysisEngineService: AnalysisEngineService) {}

  @ApiOperation({ summary: 'List all analysis runs (history)' })
  @Get('runs')
  getRuns() {
    return this.analysisEngineService.getRuns();
  }

  @ApiOperation({ summary: 'Get a specific run with its findings' })
  @Get('runs/:id')
  getRunById(@Param('id') id: string) {
    return this.analysisEngineService.getRunById(id);
  }

  @ApiOperation({ summary: 'Execute a new GRC analysis run synchronously' })
  @Post('runs')
  executeRun(@Body() dto: CreateAnalysisRunDto, @Req() req: any) {
    const executedBy = req.user?.email || 'system';
    return this.analysisEngineService.executeRun(dto, executedBy);
  }
}
