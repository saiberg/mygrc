import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MasterDataService } from './master-data.service';
import { CreateGrcUserDto } from './dto/create-grc-user.dto';
import { CreateGrcRoleDto } from './dto/create-grc-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('Master Data / CRUD')
@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // --- USERS ---
  @ApiOperation({ summary: 'List all GRC Users' })
  @Get('users')
  getUsers() {
    return this.masterDataService.getUsers();
  }

  @ApiOperation({ summary: 'Create a new GRC User' })
  @Post('users')
  createUser(@Body() dto: CreateGrcUserDto) {
    return this.masterDataService.createUser(dto);
  }

  @ApiOperation({ summary: 'Update a GRC User' })
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: Partial<CreateGrcUserDto>) {
    return this.masterDataService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Toggle GRC User status' })
  @Patch('users/:id/toggle')
  toggleUserStatus(@Param('id') id: string) {
    return this.masterDataService.toggleUserStatus(id);
  }

  @ApiOperation({ summary: 'Delete a GRC User' })
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.masterDataService.deleteUser(id);
  }

  // --- ROLES ---
  @ApiOperation({ summary: 'List all GRC Roles' })
  @Get('roles')
  getRoles() {
    return this.masterDataService.getRoles();
  }

  @ApiOperation({ summary: 'Create a new GRC Role' })
  @Post('roles')
  createRole(@Body() dto: CreateGrcRoleDto) {
    return this.masterDataService.createRole(dto);
  }

  @ApiOperation({ summary: 'Update a GRC Role' })
  @Patch('roles/:id')
  updateRole(@Param('id') id: string, @Body() dto: Partial<CreateGrcRoleDto>) {
    return this.masterDataService.updateRole(id, dto);
  }

  @ApiOperation({ summary: 'Toggle GRC Role status' })
  @Patch('roles/:id/toggle')
  toggleRoleStatus(@Param('id') id: string) {
    return this.masterDataService.toggleRoleStatus(id);
  }

  @ApiOperation({ summary: 'Delete a GRC Role' })
  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.masterDataService.deleteRole(id);
  }

  // --- ASSIGNMENTS ---
  @ApiOperation({ summary: 'List all Role Assignments' })
  @Get('assignments')
  getAssignments() {
    return this.masterDataService.getAssignments();
  }

  @ApiOperation({ summary: 'Assign a Role to a User' })
  @Post('assignments')
  assignRole(@Body() dto: AssignRoleDto) {
    return this.masterDataService.assignRole(dto);
  }

  @ApiOperation({ summary: 'Remove a Role Assignment' })
  @Delete('assignments/:id')
  removeAssignment(@Param('id') id: string) {
    return this.masterDataService.removeAssignment(id);
  }

  // --- ROLE TRANSACTIONS ---
  @ApiOperation({ summary: 'List all Role Transactions' })
  @Get('role-transactions')
  getRoleTrxs() {
    return this.masterDataService.getRoleTrxs();
  }

  @ApiOperation({ summary: 'List transactions for a specific role' })
  @Get('role-transactions/by-role/:roleName')
  getRoleTrxsByRole(@Param('roleName') roleName: string) {
    return this.masterDataService.getRoleTrxsByRole(roleName);
  }

  @ApiOperation({ summary: 'Create a new Role Transaction' })
  @Post('role-transactions')
  createRoleTrx(@Body() dto: { role_name: string; object: string; field: string; transaction: string }) {
    return this.masterDataService.createRoleTrx(dto);
  }

  @ApiOperation({ summary: 'Delete a Role Transaction' })
  @Delete('role-transactions/:id')
  deleteRoleTrx(@Param('id') id: string) {
    return this.masterDataService.deleteRoleTrx(id);
  }
}
