import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      openFindings,
      mitigatedFindings,
      falsePositiveFindings,
      totalFindings,
      criticalRules,
      totalRules,
      completedRuns,
      totalRuns,
    ] = await Promise.all([
      this.prisma.grcUser.count(),
      this.prisma.grcUser.count({ where: { status: true } }),
      this.prisma.grcFinding.count({ where: { finding_status: 'Open' } }),
      this.prisma.grcFinding.count({ where: { finding_status: 'Mitigated' } }),
      this.prisma.grcFinding.count({ where: { finding_status: 'False Positive' } }),
      this.prisma.grcFinding.count(),
      this.prisma.grcRiskRule.count({
        where: {
          risk_level: { in: ['CRITICAL', 'Critical'] },
          active_flag: true,
        },
      }),
      this.prisma.grcRiskRule.count({ where: { active_flag: true } }),
      this.prisma.grcAnalysisRun.count({ where: { status: 'Completed' } }),
      this.prisma.grcAnalysisRun.count(),
    ]);

    const mitigationRate = totalFindings > 0
      ? Math.round((mitigatedFindings / totalFindings) * 100)
      : 0;
    const openRate = totalFindings > 0
      ? Math.round((openFindings / totalFindings) * 100)
      : 0;

    return {
      kpis: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        openFindings,
        mitigatedFindings,
        falsePositiveFindings,
        totalFindings,
        criticalRules,
        totalRules,
        completedRuns,
        totalRuns,
        mitigationRate,
        openRate,
      },
    };
  }

  async getFindingsByRisk() {
    const findings = await this.prisma.grcFinding.groupBy({
      by: ['risk_level'],
      _count: { _all: true },
    });

    const levels = ['Critical', 'High', 'Medium', 'Low'];
    const colors: Record<string, string> = {
      Critical: '#e11d48',
      High: '#f97316',
      Medium: '#eab308',
      Low: '#3b82f6',
    };

    return levels.map(level => {
      const found = findings.find(
        f => f.risk_level.toUpperCase() === level.toUpperCase()
      );
      return {
        name: level,
        count: found ? found._count._all : 0,
        fill: colors[level],
      };
    });
  }

  async getHeatmapData() {
    const findings = await this.prisma.grcFinding.findMany({
      include: {
        role: { select: { process_area: true } },
        rule: { select: { risk_level: true } },
      },
    });

    const areaMap: Record<string, { critical: number; high: number; medium: number; low: number }> = {};

    findings.forEach(f => {
      const area = f.role?.process_area || 'General';
      if (!areaMap[area]) {
        areaMap[area] = { critical: 0, high: 0, medium: 0, low: 0 };
      }
      const lvl = (f.rule?.risk_level || f.risk_level || '').toUpperCase();
      if (lvl === 'CRITICAL') areaMap[area].critical++;
      else if (lvl === 'HIGH') areaMap[area].high++;
      else if (lvl === 'MEDIUM') areaMap[area].medium++;
      else if (lvl === 'LOW') areaMap[area].low++;
    });

    if (Object.keys(areaMap).length === 0) {
      const roles = await this.prisma.grcRole.findMany({
        select: { process_area: true },
        distinct: ['process_area'],
      });
      const areas = roles.map(r => r.process_area).filter(Boolean);
      if (areas.length === 0) areas.push('Finance', 'HR', 'IT', 'Procurement');
      return areas.map(area => ({
        area,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      }));
    }

    return Object.entries(areaMap)
      .map(([area, counts]) => ({ area, ...counts }))
      .sort((a, b) => (b.critical + b.high) - (a.critical + a.high));
  }

  async getRecentRuns() {
    return this.prisma.grcAnalysisRun.findMany({
      orderBy: { run_date: 'desc' },
      take: 5,
      select: {
        id_run: true,
        run_name: true,
        scope_type: true,
        status: true,
        run_date: true,
        executed_by: true,
        _count: { select: { findings: true } },
      },
    });
  }

  async getTopRules() {
    const findings = await this.prisma.grcFinding.findMany({
      include: {
        rule: { select: { rule_code: true, rule_name: true, risk_level: true } },
      },
    });

    const ruleMap = new Map<string, {
      rule_code: string;
      rule_name: string;
      risk_level: string;
      count: number;
    }>();

    findings.forEach(f => {
      if (!f.rule) return;
      const key = f.rule.rule_code;
      const cur = ruleMap.get(key) ?? {
        rule_code: f.rule.rule_code,
        rule_name: f.rule.rule_name,
        risk_level: f.rule.risk_level,
        count: 0,
      };
      ruleMap.set(key, { ...cur, count: cur.count + 1 });
    });

    return [...ruleMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
