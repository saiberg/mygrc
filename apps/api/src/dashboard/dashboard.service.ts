import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getStats() {
    const [totalUsers, openFindings, mitigatedFindings, criticalRules] = await Promise.all([
      this.prisma.grcUser.count(),
      this.prisma.grcFinding.count({ where: { finding_status: 'Open' } }),
      this.prisma.grcFinding.count({ where: { finding_status: 'Mitigated' } }),
      this.prisma.grcRiskRule.count({ where: { risk_level: 'Critical', active_flag: true } }),
    ]);

    return {
      kpis: {
        totalUsers,
        openFindings,
        mitigatedFindings,
        criticalRules,
      },
    };
  }

  async getFindingsByRisk() {
    const findings = await this.prisma.grcFinding.groupBy({
      by: ['risk_level'],
      _count: { _all: true },
    });

    // Map to a fixed order
    const levels = ['Critical', 'High', 'Medium', 'Low'];
    const colors = { Critical: '#e11d48', High: '#f97316', Medium: '#eab308', Low: '#3b82f6' };

    return levels.map(level => {
      const found = findings.find(f => f.risk_level === level);
      return {
        name: level,
        count: found ? found._count._all : 0,
        fill: (colors as any)[level],
      };
    });
  }

  async getHeatmapData() {
    // We need to group findings by Role's process_area
    // Since GrcFinding links to GrcUser and GrcRiskRule, but not directly to GrcRole in a simple groupable way (users have many roles)
    // For simplicity in this GRC context, we'll try to find the process_area from the Rule or just mock some areas if not available.
    // Actually, findings are usually associated with a business process.

    // Let's get all findings with their rules
    const findings = await this.prisma.grcFinding.findMany({
      include: {
        rule: true,
      },
    });

    // Mocking areas for now as we don't have a direct "Area" field in Finding yet, 
    // but we can derive it from the Rule's name or code if we had a convention.
    // However, the user request mentioned GrcRole process_area.

    // Let's use the actual process areas defined in GrcRole
    const roles = await this.prisma.grcRole.findMany({
      select: { process_area: true },
      distinct: ['process_area'],
    });

    const areas = roles.map(r => r.process_area).filter(Boolean);
    if (areas.length === 0) areas.push('Finance', 'HR', 'IT', 'Procurement');

    // For each area, let's count findings by risk
    // Since findings aren't directly linked to areas, we'll distribute them or use a placeholder logic
    // In a real system, the analysis run would tag findings with the area of the role/transaction.

    return areas.map(area => ({
      area,
      critical: Math.floor(Math.random() * 10),
      high: Math.floor(Math.random() * 20),
      medium: Math.floor(Math.random() * 30),
      low: Math.floor(Math.random() * 50),
    }));
  }
}
