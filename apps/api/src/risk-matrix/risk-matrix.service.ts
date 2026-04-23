import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRiskRuleDto } from './dto/create-risk-rule.dto';

@Injectable()
export class RiskMatrixService {
  constructor(private readonly prisma: PrismaService) {}

  async getRules() {
    return this.prisma.grcRiskRule.findMany({
      include: {
        items: { orderBy: { seq_no: 'asc' } },
        _count: { select: { findings: true } },
      },
      orderBy: { risk_level: 'asc' },
    });
  }

  async getRuleById(id_rule: string) {
    const rule = await this.prisma.grcRiskRule.findUnique({
      where: { id_rule },
      include: { items: { orderBy: { seq_no: 'asc' } } },
    });
    if (!rule) throw new NotFoundException(`Rule ${id_rule} not found`);
    return rule;
  }

  async createRule(dto: CreateRiskRuleDto) {
    const exists = await this.prisma.grcRiskRule.findUnique({ where: { rule_code: dto.rule_code } });
    if (exists) throw new ConflictException(`Rule with code ${dto.rule_code} already exists`);

    const { items, ...ruleData } = dto;

    return this.prisma.grcRiskRule.create({
      data: {
        ...ruleData,
        active_flag: ruleData.active_flag ?? true,
        institutionId: '',
        items: items && items.length > 0
          ? { create: items.map(item => ({ ...item })) }
          : undefined,
      },
      include: { items: true },
    });
  }

  async toggleActive(id_rule: string) {
    const rule = await this.prisma.grcRiskRule.findUnique({ where: { id_rule } });
    if (!rule) throw new NotFoundException(`Rule ${id_rule} not found`);
    return this.prisma.grcRiskRule.update({
      where: { id_rule },
      data: { active_flag: !rule.active_flag },
    });
  }

  async deleteRule(id_rule: string) {
    const rule = await this.prisma.grcRiskRule.findUnique({ where: { id_rule } });
    if (!rule) throw new NotFoundException(`Rule ${id_rule} not found`);
    // Delete items first to respect FK
    await this.prisma.grcRuleItem.deleteMany({ where: { id_rule } });
    return this.prisma.grcRiskRule.delete({ where: { id_rule } });
  }
}
