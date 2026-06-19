import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMitigationDto } from './dto/create-mitigation.dto';

@Injectable()
export class FindingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFindings(status?: string, risk_level?: string, run_name?: string) {
    return this.prisma.grcFinding.findMany({
      where: {
        ...(status ? { finding_status: status } : {}),
        ...(risk_level ? { risk_level } : {}),
        ...(run_name ? { run: { run_name } } : {}),
      },
      include: {
        user: { select: { user_code: true, full_name: true } },
        rule: { select: { rule_code: true, rule_name: true, rule_type: true } },
        run: { select: { run_name: true, run_date: true } },
        mitigation: true,
      },
      orderBy: [{ risk_level: 'asc' }, { created_at: 'desc' }],
    });
  }

  async getFindingById(id_finding: string) {
    const finding = await this.prisma.grcFinding.findUnique({
      where: { id_finding },
      include: { user: true, rule: true, run: true, mitigation: true },
    });
    if (!finding) throw new NotFoundException(`Finding ${id_finding} not found`);
    return finding;
  }

  async updateStatus(id_finding: string, status: string) {
    return this.prisma.grcFinding.update({
      where: { id_finding },
      data: { finding_status: status },
    });
  }

  async addMitigation(id_finding: string, dto: CreateMitigationDto) {
    const finding = await this.prisma.grcFinding.findUnique({ where: { id_finding } });
    if (!finding) throw new NotFoundException(`Finding ${id_finding} not found`);

    const mitigation = await this.prisma.grcMitigation.upsert({
      where: { id_finding },
      update: {
        owner_name: dto.owner_name,
        comments: dto.comments,
        valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
        approval_status: 'Pending',
      },
      create: {
        id_finding,
        owner_name: dto.owner_name,
        comments: dto.comments,
        valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
        approval_status: 'Pending',
      },
    });

    // Auto-update finding status
    await this.prisma.grcFinding.update({
      where: { id_finding },
      data: { finding_status: 'Mitigated' },
    });

    return mitigation;
  }

  async getFindingSummary() {
    const [total, open, mitigated, falsePositive, critical, high] = await Promise.all([
      this.prisma.grcFinding.count(),
      this.prisma.grcFinding.count({ where: { finding_status: 'Open' } }),
      this.prisma.grcFinding.count({ where: { finding_status: 'Mitigated' } }),
      this.prisma.grcFinding.count({ where: { finding_status: 'False Positive' } }),
      this.prisma.grcFinding.count({ where: { risk_level: 'Critical' } }),
      this.prisma.grcFinding.count({ where: { risk_level: 'High' } }),
    ]);
    return { total, open, mitigated, falsePositive, critical, high };
  }
}
