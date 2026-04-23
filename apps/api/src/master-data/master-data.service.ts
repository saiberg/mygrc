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
        institutionId: '', // Satisfy Prisma TS Types. PrismaService Interceptor overrides this at runtime.
      }
    });
  }

  async deleteUser(id_user: string) {
    return this.prisma.grcUser.delete({
      where: { id_user },
    });
  }

  // --- ROLES ---
  async getRoles() {
    return this.prisma.grcRole.findMany();
  }

  async createRole(dto: CreateGrcRoleDto) {
    const exists = await this.prisma.grcRole.findUnique({
      where: { role_name: dto.role_name },
    });
    if (exists) throw new ConflictException(`Role with name ${dto.role_name} already exists.`);

    return this.prisma.grcRole.create({
      data: {
        ...dto,
        institutionId: '', // TS Dummy
      }
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
    });
  }

  async assignRole(dto: AssignRoleDto) {
    // Validate User & Role exist
    const user = await this.prisma.grcUser.findUnique({ where: { id_user: dto.id_user } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.grcRole.findUnique({ where: { id_role: dto.id_role } });
    if (!role) throw new NotFoundException('Role not found');

    return this.prisma.grcUserRole.create({
      data: {
        id_user: dto.id_user,
        id_role: dto.id_role,
        valid_from: new Date(dto.valid_from),
        valid_to: dto.valid_to ? new Date(dto.valid_to) : null,
        institutionId: '', // TS Dummy
      }
    });
  }

  async removeAssignment(id_user_role: string) {
    return this.prisma.grcUserRole.delete({
      where: { id_user_role },
    });
  }
}
