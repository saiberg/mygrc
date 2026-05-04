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
          include: { user: true, rule: true, mitigation: true },
          orderBy: { risk_level: 'asc' },
        },
      },
    });
    if (!run) throw new NotFoundException(`Run ${id_run} not found`);
    return run;
  }

  /**
   * Executes an analysis run synchronously:
   * 1. Creates the GrcAnalysisRun record with status "Running"
   * 2. Loads all active rules and all users in scope
   * 3. Checks each user's assigned roles against each rule's items
   * 4. Creates GrcFinding records for conflicts found
   * 5. Updates the run status to "Completed"
   */
  async executeRun(dto: CreateAnalysisRunDto, executedBy: string) {
    // 1. Create run record
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
      // 2. Load active rules with their items
      const activeRules = await this.prisma.grcRiskRule.findMany({
        where: { active_flag: true },
        include: { items: true },
      });

      // 3. Load users with their role assignments
      const users = await this.prisma.grcUser.findMany({
        where: { status: true },
        include: {
          roles: {
            where: { status: true },
            include: { role: true },
          },
        },
      });

      let findingsCreated = 0;

      // 4. Apply SoD conflict detection
      for (const rule of activeRules) {
        const ruleObjectValues = rule.items.map(i => i.object_value.toUpperCase());

        for (const user of users) {
          const userRoleNames = user.roles.map(r => r.role.role_name.toUpperCase());

          // Check if the user has any role matching the rule objects (simplified SoD check)
          const hasConflict = ruleObjectValues.some(val => userRoleNames.includes(val));

          if (hasConflict) {
            // Check for existing open finding to avoid duplicates
            const existingFinding = await this.prisma.grcFinding.findFirst({
              where: {
                id_run: run.id_run,
                id_user: user.id_user,
                id_rule: rule.id_rule,
              },
            });

            if (!existingFinding) {
              await this.prisma.grcFinding.create({
                data: {
                  id_run: run.id_run,
                  id_user: user.id_user,
                  id_rule: rule.id_rule,
                  risk_level: rule.risk_level,
                  finding_status: 'Open',
                  evidence_text: `User has roles matching rule objects: ${ruleObjectValues.join(', ')}`,
                  institutionId: instId,
                },
              });
              findingsCreated++;
            }
          }
        }
      }

      // 5. Update run to Completed
      return this.prisma.grcAnalysisRun.update({
        where: { id_run: run.id_run },
        data: {
          status: 'Completed',
        },
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
