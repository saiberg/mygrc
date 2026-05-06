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
            // Aggregate all transactions from all assigned roles
            const userTcodes = new Set<string>();
            user.roles.forEach(ur => {
              ur.role.roleTrxs.forEach(rt => userTcodes.add(rt.transaction.toUpperCase()));
            });

            // Conflict if user has ALL required transactions across all roles
            const hasConflict = requiredTcodes.every(tc => userTcodes.has(tc));

            if (hasConflict) {
              await this.prisma.grcFinding.create({
                data: {
                  id_run: run.id_run,
                  id_user: user.id_user,
                  id_rule: rule.id_rule,
                  risk_level: rule.risk_level,
                  finding_status: 'Open',
                  evidence_text: `User has access to all conflicting transactions through assigned roles: ${requiredTcodes.join(', ')}`,
                  institutionId: instId,
                },
              });
              findingsCreated++;
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
