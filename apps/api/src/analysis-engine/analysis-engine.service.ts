import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisRunDto } from './dto/create-analysis-run.dto';

@Injectable()
export class AnalysisEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async getRuns() {
    return this.prisma.grcAnalysisRun.findMany({
      include: {
        _count: { select: { findings: true } },
      },
      orderBy: { run_date: 'desc' },
    });
  }

  async getRunById(id_run: string) {
    const run = await this.prisma.grcAnalysisRun.findUnique({
      where: { id_run },
      include: {
        findings: {
          include: { user: true, role: true, rule: true, mitigation: true },
          orderBy: { risk_level: 'asc' },
        },
      },
    });
    if (!run) throw new NotFoundException(`Run ${id_run} not found`);
    return run;
  }

  async getRunStats(id_run: string) {
    const run = await this.prisma.grcAnalysisRun.findUnique({
      where: { id_run },
      include: {
        findings: {
          include: {
            user:       { select: { id_user: true, full_name: true, user_code: true } },
            role:       { select: { id_role: true, role_name: true, process_area: true } },
            rule:       { select: { id_rule: true, rule_name: true, rule_code: true, risk_level: true } },
            mitigation: { select: { approval_status: true } },
          },
        },
      },
    });
    if (!run) throw new NotFoundException(`Run ${id_run} not found`);

    const findings = run.findings;
    const total = findings.length;

    // --- By risk level ---
    const byRisk = ['Critical', 'High', 'Medium', 'Low'].map(level => ({
      name: level,
      count: findings.filter(f => f.risk_level === level).length,
    }));

    // --- By status ---
    const byStatus = ['Open', 'Mitigated', 'False Positive'].map(status => ({
      name: status,
      count: findings.filter(f => f.finding_status === status).length,
    }));

    // --- Top users by conflict count (User-Based runs) ---
    const userMap = new Map<string, { full_name: string; user_code: string; count: number }>();
    for (const f of findings) {
      if (f.user) {
        const key = f.user.id_user;
        const cur = userMap.get(key) ?? { full_name: f.user.full_name, user_code: f.user.user_code, count: 0 };
        userMap.set(key, { ...cur, count: cur.count + 1 });
      }
    }
    const topUsers = [...userMap.values()].sort((a, b) => b.count - a.count).slice(0, 5);

    // --- Top roles by conflict count ---
    const roleMap = new Map<string, { role_name: string; process_area: string; count: number }>();
    for (const f of findings) {
      if (f.role) {
        const key = f.role.id_role;
        const cur = roleMap.get(key) ?? { role_name: f.role.role_name, process_area: f.role.process_area ?? '', count: 0 };
        roleMap.set(key, { ...cur, count: cur.count + 1 });
      }
    }
    const topRoles = [...roleMap.values()].sort((a, b) => b.count - a.count).slice(0, 5);

    // --- Top triggered rules ---
    const ruleMap = new Map<string, { rule_name: string; rule_code: string; risk_level: string; count: number }>();
    for (const f of findings) {
      if (f.rule) {
        const key = f.rule.id_rule;
        const cur = ruleMap.get(key) ?? { rule_name: f.rule.rule_name, rule_code: f.rule.rule_code, risk_level: f.rule.risk_level, count: 0 };
        ruleMap.set(key, { ...cur, count: cur.count + 1 });
      }
    }
    const topRules = [...ruleMap.values()].sort((a, b) => b.count - a.count).slice(0, 8);

    // --- Mitigation rate ---
    const mitigated = findings.filter(f => f.finding_status === 'Mitigated').length;
    const mitigationRate = total > 0 ? Math.round((mitigated / total) * 100) : 0;

    return {
      run: {
        id_run: run.id_run,
        run_name: run.run_name,
        run_date: run.run_date,
        scope_type: run.scope_type,
        scope_value: run.scope_value,
        status: run.status,
        executed_by: run.executed_by,
      },
      total,
      mitigationRate,
      byRisk,
      byStatus,
      topUsers,
      topRoles,
      topRules,
    };
  }

  async getRunExecutiveReport(id_run: string) {
    const run = await this.prisma.grcAnalysisRun.findUnique({
      where: { id_run },
      include: {
        findings: {
          include: {
            user: { select: { id_user: true, full_name: true, user_code: true, status: true } },
            role: { select: { id_role: true, role_name: true, process_area: true } },
            rule: { select: { id_rule: true, rule_name: true, rule_code: true, risk_level: true } },
            mitigation: { select: { approval_status: true } },
          },
        },
      },
    });
    if (!run) throw new NotFoundException(`Run ${id_run} not found`);

    const findings = run.findings;
    const totalFindings = findings.length;

    // 1. Get system user and role metrics
    const totalUsers = await this.prisma.grcUser.count();
    const activeUsers = await this.prisma.grcUser.count({ where: { status: true } });
    const inactiveUsers = totalUsers - activeUsers;
    const totalRoles = await this.prisma.grcRole.count();
    const inactiveRoles = await this.prisma.grcRole.count({ where: { status: false } });

    // Calculate unique users with conflicts in this run
    const usersWithConflicts = new Set<string>();
    const usersWithCriticalConflicts = new Set<string>();
    findings.forEach(f => {
      if (f.user) {
        usersWithConflicts.add(f.user.id_user);
        if (f.risk_level === 'Critical' || f.risk_level === 'High') {
          usersWithCriticalConflicts.add(f.user.id_user);
        }
      }
    });

    const uniqueUsersWithConflicts = usersWithConflicts.size;
    const uniqueUsersWithCritical = usersWithCriticalConflicts.size;

    // KPIs:
    const sodRate = activeUsers > 0 ? Number(((uniqueUsersWithConflicts / activeUsers) * 100).toFixed(1)) : 0;
    const criticalAccessRate = activeUsers > 0 ? Number(((uniqueUsersWithCritical / activeUsers) * 100).toFixed(1)) : 0;
    const inactiveUsersRate = totalUsers > 0 ? Number(((inactiveUsers / totalUsers) * 100).toFixed(1)) : 0;
    const complianceRate = Number((100 - sodRate).toFixed(1));

    const mitigated = findings.filter(f => f.finding_status === 'Mitigated').length;
    const mitigationRate = totalFindings > 0 ? Math.round((mitigated / totalFindings) * 100) : 0;

    // Finding counts chart categories: SoD, Critical, Inactive, Obsolete
    const criticalCount = findings.filter(f => f.risk_level === 'Critical' || f.risk_level === 'High').length;
    const inactiveCount = findings.filter(f => f.user && !f.user.status).length;
    const obsoleteCount = inactiveRoles;

    const findingCounts = [
      { name: 'SoD', count: totalFindings },
      { name: 'Critical', count: criticalCount },
      { name: 'Inactive', count: inactiveCount },
      { name: 'Obsolete', count: obsoleteCount }
    ];

    // Heat Map: High, Medium, Low breakdown by Process Area
    const heatMapData: Record<string, { area: string; critical: number; high: number; medium: number; low: number }> = {};
    findings.forEach(f => {
      const area = f.role?.process_area || f.rule?.rule_name?.split(' ')[0] || 'General';
      if (!heatMapData[area]) {
        heatMapData[area] = { area, critical: 0, high: 0, medium: 0, low: 0 };
      }
      const lvl = (f.risk_level || 'Medium').toLowerCase();
      if (lvl === 'critical') heatMapData[area].critical++;
      else if (lvl === 'high') heatMapData[area].high++;
      else if (lvl === 'medium') heatMapData[area].medium++;
      else if (lvl === 'low') heatMapData[area].low++;
    });

    const heatMap = Object.values(heatMapData).sort((a, b) => 
      (b.critical + b.high) - (a.critical + a.high)
    ).slice(0, 6);

    // Module Distribution: users by module (Basis, HR/ECP, FI, MM, SD)
    const moduleCounts: Record<string, Set<string>> = {
      'Basis': new Set(),
      'HR/ECP': new Set(),
      'FI': new Set(),
      'MM': new Set(),
      'SD': new Set()
    };

    findings.forEach(f => {
      const area = (f.role?.process_area || f.rule?.rule_name || '').toUpperCase();
      const entityId = f.user?.id_user || f.role?.id_role || '';
      if (!entityId) return;

      if (area.includes('BASIS') || area.includes('SECURITY') || area.includes('ADMIN')) {
        moduleCounts['Basis'].add(entityId);
      } else if (area.includes('HR') || area.includes('PAYROLL') || area.includes('ECP') || area.includes('PEOPLE')) {
        moduleCounts['HR/ECP'].add(entityId);
      } else if (area.includes('FI') || area.includes('FINANCE') || area.includes('AP') || area.includes('PAYMENT')) {
        moduleCounts['FI'].add(entityId);
      } else if (area.includes('MM') || area.includes('MATERIAL') || area.includes('PURCH')) {
        moduleCounts['MM'].add(entityId);
      } else if (area.includes('SD') || area.includes('SALES') || area.includes('ORDER')) {
        moduleCounts['SD'].add(entityId);
      } else {
        moduleCounts['FI'].add(entityId);
      }
    });

    const moduleDistribution = Object.keys(moduleCounts).map(module => ({
      name: module,
      count: moduleCounts[module].size
    })).sort((a, b) => b.count - a.count);

    // Maturity Level: rating 1.0 to 5.0
    const complianceBonus = (complianceRate / 100) * 1.5;
    const mitigationBonus = (mitigationRate / 100) * 1.5;
    const maturityScore = Number((2.0 + complianceBonus + mitigationBonus).toFixed(1));

    // Top Findings: Top 10 findings of the run
    const ruleGroups: Record<string, { rule_code: string; rule_name: string; risk_level: string; count: number }> = {};
    findings.forEach(f => {
      if (!f.rule) return;
      const key = f.rule.rule_code;
      if (!ruleGroups[key]) {
        ruleGroups[key] = {
          rule_code: f.rule.rule_code,
          rule_name: f.rule.rule_name,
          risk_level: f.rule.risk_level,
          count: 0
        };
      }
      ruleGroups[key].count++;
    });

    const topFindings = Object.values(ruleGroups)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((r, i) => ({
        id: i + 1,
        title: `${r.rule_name} (${r.rule_code})`,
        riskLevel: r.risk_level,
        count: r.count
      }));

    // Remediation Roadmap (30/60/90 Days)
    const highestRiskRule = Object.values(ruleGroups).sort((a, b) => b.count - a.count)[0];
    const highRiskRules = Object.values(ruleGroups).filter(r => r.risk_level === 'Critical' || r.risk_level === 'High');

    const roadmap = {
      days30: highestRiskRule 
        ? `Remove critical SoD conflicts, prioritize Rule: ${highestRiskRule.rule_code} (${highestRiskRule.rule_name})`
        : "Remove critical SoD conflicts and access vulnerabilities in SAP profiles.",
      days60: highRiskRules.length > 1
        ? `Role redesign for roles triggering rules: ${highRiskRules.slice(0, 3).map(r => r.rule_code).join(', ')}`
        : "Implement access recertification and role maintenance workflows.",
      days90: "Continuous compliance controls monitoring and full SAP GRC assessment."
    };

    // Executive Conclusion
    let overallRisk = 'Low';
    if (findings.some(f => f.risk_level === 'Critical')) overallRisk = 'Critical';
    else if (findings.some(f => f.risk_level === 'High')) overallRisk = 'High';
    else if (findings.some(f => f.risk_level === 'Medium')) overallRisk = 'Medium';

    return {
      run: {
        id_run: run.id_run,
        run_name: run.run_name,
        run_date: run.run_date,
        scope_type: run.scope_type,
        scope_value: run.scope_value,
        status: run.status,
        executed_by: run.executed_by
      },
      kpis: {
        sodRate,
        criticalAccessRate,
        inactiveUsersRate,
        complianceRate,
        mitigationRate
      },
      findingCounts,
      heatMap,
      moduleDistribution,
      maturity: {
        score: maturityScore,
        levels: [
          { level: 1, name: 'Ad Hoc', desc: 'Processes are undocumented and in a state of dynamic change.' },
          { level: 2, name: 'Repeatable', desc: 'Processes are repeatable, possibly with consistent results.' },
          { level: 3, name: 'Defined', desc: 'Processes are documented, standardized and integrated.' },
          { level: 4, name: 'Managed', desc: 'Processes are managed according to metrics.' },
          { level: 5, name: 'Optimized', desc: 'Management includes deliberate process optimization/feedback.' }
        ]
      },
      topFindings,
      roadmap,
      conclusion: {
        overallRisk,
        remediationTarget: `Target maturity level: 4/5 within 12 months. Immediate remediation recommended for ${criticalCount} critical and high access conflicts.`
      }
    };
  }


  /**
   * Executes an analysis run:
   * 1. User-Based: Aggregates all transactions from all user roles to find SoD conflicts.
   * 2. Role-Based: Checks individual roles for internal SoD conflicts.
   */
  async executeRun(dto: CreateAnalysisRunDto, executedBy: string) {
    const institution = await this.prisma.institution.findFirst();
    const instId = institution?.id || '';

    const run = await this.prisma.grcAnalysisRun.create({
      data: {
        run_name: dto.run_name,
        scope_type: dto.scope_type,
        scope_value: dto.scope_value,
        executed_by: dto.executed_by || executedBy,
        status: 'Running',
        institutionId: instId,
      },
    });

    try {
      const activeRules = await this.prisma.grcRiskRule.findMany({
        where: { active_flag: true },
        include: { items: true },
      });

      let findingsCreated = 0;

      if (dto.scope_type === 'Role-Based') {
        const roles = await this.prisma.grcRole.findMany({
          where: { status: true },
          include: { roleTrxs: true },
        });

        for (const rule of activeRules) {
          const requiredTcodes = rule.items.map(i => i.object_value.toUpperCase());
          if (requiredTcodes.length === 0) continue;

          for (const role of roles) {
            const roleTcodes = new Set(role.roleTrxs.map(t => t.transaction.toUpperCase()));
            
            // Conflict if role has ALL required transactions
            const hasConflict = requiredTcodes.every(tc => roleTcodes.has(tc));

            if (hasConflict) {
              await this.prisma.grcFinding.create({
                data: {
                  id_run: run.id_run,
                  id_role: role.id_role,
                  id_rule: rule.id_rule,
                  risk_level: rule.risk_level,
                  finding_status: 'Open',
                  evidence_text: `Role "${role.role_name}" contains all conflicting transactions: ${requiredTcodes.join(', ')}`,
                  institutionId: instId,
                },
              });
              findingsCreated++;
            }
          }
        }
      } 
      else {
        // User-Based (Default)
        const users = await this.prisma.grcUser.findMany({
          where: { status: true },
          include: {
            roles: {
              where: { status: true },
              include: { 
                role: {
                  include: { roleTrxs: true }
                }
              },
            },
          },
        });

        for (const rule of activeRules) {
          const requiredTcodes = rule.items.map(i => i.object_value.toUpperCase());
          if (requiredTcodes.length === 0) continue;

          for (const user of users) {
            // Build a map of role ID to its transactions
            const roleTransactionMap = new Map<string, Set<string>>();
            user.roles.forEach(ur => {
              const roleTcodes = new Set<string>();
              ur.role.roleTrxs.forEach(rt => roleTcodes.add(rt.transaction.toUpperCase()));
              roleTransactionMap.set(ur.role.id_role, roleTcodes);
            });

            // Aggregate all transactions from all assigned roles
            const userTcodes = new Set<string>();
            roleTransactionMap.forEach(tcodes => {
              tcodes.forEach(tc => userTcodes.add(tc));
            });

            // Conflict if user has ALL required transactions across all roles
            const hasConflict = requiredTcodes.every(tc => userTcodes.has(tc));

            if (hasConflict) {
              // Create a finding for each role that contributes to the conflict
              for (const [roleId, roleTcodes] of roleTransactionMap.entries()) {
                const conflictingTcodes = requiredTcodes.filter(tc => roleTcodes.has(tc));
                
                if (conflictingTcodes.length > 0) {
                  await this.prisma.grcFinding.create({
                    data: {
                      id_run: run.id_run,
                      id_user: user.id_user,
                      id_role: roleId,
                      id_rule: rule.id_rule,
                      risk_level: rule.risk_level,
                      finding_status: 'Open',
                      evidence_text: `User role contains conflicting transactions: ${conflictingTcodes.join(', ')}`,
                      institutionId: instId,
                    },
                  });
                  findingsCreated++;
                }
              }
            }
          }
        }
      }

      return this.prisma.grcAnalysisRun.update({
        where: { id_run: run.id_run },
        data: { status: 'Completed' },
        include: { _count: { select: { findings: true } } },
      });

    } catch (error) {
      await this.prisma.grcAnalysisRun.update({
        where: { id_run: run.id_run },
        data: { status: 'Failed' },
      });
      throw error;
    }
  }
}
