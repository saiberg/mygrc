import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGrcUserDto } from './dto/create-grc-user.dto';
import { CreateGrcRoleDto } from './dto/create-grc-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class MasterDataService {
  constructor(private readonly prisma: PrismaService) {}

  // --- USERS ---
  async getUsers() {
    return this.prisma.grcUser.findMany({
      include: {
        roles: {
          include: { role: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async createUser(dto: CreateGrcUserDto) {
    const exists = await this.prisma.grcUser.findUnique({
      where: { user_code: dto.user_code },
    });
    if (exists) throw new ConflictException(`User with code ${dto.user_code} already exists.`);

    return this.prisma.grcUser.create({
      data: {
        ...dto,
        institutionId: '',
      }
    });
  }

  async updateUser(id: string, dto: Partial<CreateGrcUserDto>) {
    return this.prisma.grcUser.update({
      where: { id_user: id },
      data: dto,
    });
  }

  async toggleUserStatus(id: string) {
    const user = await this.prisma.grcUser.findUnique({ where: { id_user: id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.grcUser.update({
      where: { id_user: id },
      data: { status: !user.status },
    });
  }

  async deleteUser(id_user: string) {
    return this.prisma.grcUser.delete({
      where: { id_user },
    });
  }

  // --- ROLES ---
  async getRoles() {
    return this.prisma.grcRole.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async createRole(dto: CreateGrcRoleDto) {
    const exists = await this.prisma.grcRole.findUnique({
      where: { role_name: dto.role_name },
    });
    if (exists) throw new ConflictException(`Role with name ${dto.role_name} already exists.`);

    return this.prisma.grcRole.create({
      data: {
        ...dto,
        institutionId: '',
      }
    });
  }

  async updateRole(id: string, dto: Partial<CreateGrcRoleDto>) {
    return this.prisma.grcRole.update({
      where: { id_role: id },
      data: dto,
    });
  }

  async toggleRoleStatus(id: string) {
    const role = await this.prisma.grcRole.findUnique({ where: { id_role: id } });
    if (!role) throw new NotFoundException('Role not found');
    return this.prisma.grcRole.update({
      where: { id_role: id },
      data: { status: !role.status },
    });
  }

  async deleteRole(id_role: string) {
    return this.prisma.grcRole.delete({
      where: { id_role },
    });
  }

  // --- ASSIGNMENTS ---
  async getAssignments() {
    return this.prisma.grcUserRole.findMany({
      include: {
        user: true,
        role: true,
      },
      orderBy: { assigned_at: 'desc' },
    });
  }

  async assignRole(dto: AssignRoleDto) {
    const user = await this.prisma.grcUser.findUnique({ where: { id_user: dto.id_user } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.grcRole.findUnique({ where: { id_role: dto.id_role } });
    if (!role) throw new NotFoundException('Role not found');

    return this.prisma.grcUserRole.create({
      data: {
        id_user: dto.id_user,
        id_role: dto.id_role,
        assigned_at: dto.assigned_at ? new Date(dto.assigned_at) : undefined,
        valid_from: dto.valid_from ? new Date(dto.valid_from) : undefined,
        valid_to: dto.valid_to ? new Date(dto.valid_to) : null,
        status: dto.status !== undefined ? dto.status : true,
        institutionId: '',
      }
    });
  }

  async removeAssignment(id_user_role: string) {
    return this.prisma.grcUserRole.delete({
      where: { id_user_role },
    });
  }

  // --- ROLE TRANSACTIONS ---
  async getRoleTrxs() {
    return this.prisma.grcRoleTrx.findMany({
      include: { role: { select: { role_name: true, process_area: true, criticality: true } } },
      orderBy: { role_name: 'asc' },
    });
  }

  async getRoleTrxsByRole(roleName: string) {
    return this.prisma.grcRoleTrx.findMany({
      where: { role_name: roleName },
      orderBy: [{ object: 'asc' }, { field: 'asc' }],
    });
  }

  async createRoleTrx(dto: { role_name: string; object: string; field: string; transaction: string }) {
    const role = await this.prisma.grcRole.findUnique({ where: { role_name: dto.role_name } });
    if (!role) throw new NotFoundException(`Role '${dto.role_name}' not found`);

    const exists = await this.prisma.grcRoleTrx.findFirst({
      where: { role_name: dto.role_name, object: dto.object, field: dto.field, transaction: dto.transaction },
    });
    if (exists) throw new ConflictException('This transaction already exists for this role.');

    return this.prisma.grcRoleTrx.create({
      data: { ...dto, institutionId: '' },
    });
  }

  async deleteRoleTrx(id_role_trx: string) {
    return this.prisma.grcRoleTrx.delete({ where: { id_role_trx } });
  }
}
