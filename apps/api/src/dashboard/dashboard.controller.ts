import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get summary KPIs for the dashboard' })
  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @ApiOperation({ summary: 'Get findings count grouped by risk level' })
  @Get('findings-by-risk')
  getFindingsByRisk() {
    return this.dashboardService.getFindingsByRisk();
  }

  @ApiOperation({ summary: 'Get risk heatmap data by business area' })
  @Get('heatmap')
  getHeatmap() {
    return this.dashboardService.getHeatmapData();
  }

  @ApiOperation({ summary: 'Get recent analysis runs' })
  @Get('recent-runs')
  getRecentRuns() {
    return this.dashboardService.getRecentRuns();
  }

  @ApiOperation({ summary: 'Get top conflicting rules' })
  @Get('top-rules')
  getTopRules() {
    return this.dashboardService.getTopRules();
  }
}
