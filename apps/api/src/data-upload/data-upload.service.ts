import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
const csvParser = require('csv-parser');

@Injectable()
export class DataUploadService {
  private readonly logger = new Logger(DataUploadService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processUploadAndImport(type: string, file: Express.Multer.File, userId: string, mode: string = 'incremental') {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv');
    const isExcel = file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls');

    if (!isCsv && !isExcel) {
      throw new BadRequestException('Only .csv and .xlsx files are supported');
    }

    // 1. Create Import Log entry
    const importLog = await this.prisma.grcImportLog.create({
      data: {
        import_type: type,
        file_name: file.originalname,
        imported_by: userId,
        result_status: 'Processing',
        institutionId: '', 
      },
    });

    try {
      // 2. Parse file synchronously into JSON array
      const rows = await this.parseFile(file, isCsv);

      // 3. Handle 'Replace' mode cleanup
      if (mode === 'replace') {
        this.logger.log(`Performing wipe for type: ${type} due to replacement mode`);
        if (type === 'users') {
          await this.prisma.grcUserRole.deleteMany({});
          await this.prisma.grcUser.deleteMany({});
        } else if (type === 'roles') {
          await this.prisma.grcUserRole.deleteMany({});
          await this.prisma.grcRole.deleteMany({});
        } else if (type === 'assignments') {
          await this.prisma.grcUserRole.deleteMany({});
        } else if (type === 'risk-rules') {
          await this.prisma.grcRuleItem.deleteMany({});
          await this.prisma.grcRiskRule.deleteMany({});
        } else if (type === 'rule-items') {
          await this.prisma.grcRuleItem.deleteMany({});
        } else if (type === 'role-transactions') {
          await this.prisma.grcRoleTrx.deleteMany({});
        }
      }

      // 4. Process records
      const { okRows, errorRows, message } = await this.processRows(type, rows);

      // 5. Update Import Log successfully
      const finalStatus = errorRows > 0 ? (okRows > 0 ? 'Partial' : 'Failed') : 'Success';
      
      const finishedLog = await this.prisma.grcImportLog.update({
        where: { id_import: importLog.id_import },
        data: {
          finished_at: new Date(),
          total_rows: rows.length,
          ok_rows: okRows,
          error_rows: errorRows,
          result_status: finalStatus,
          message_text: message,
        },
      });

      return finishedLog;

    } catch (error: any) {
      this.logger.error(`Import failed: ${error.message}`);
      
      await this.prisma.grcImportLog.update({
        where: { id_import: importLog.id_import },
        data: {
          finished_at: new Date(),
          result_status: 'Fatal Error',
          message_text: error.message,
        },
      });

      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }

  private async parseFile(file: Express.Multer.File, isCsv: boolean): Promise<any[]> {
    if (isCsv) {
      return new Promise((resolve, reject) => {
        const results: any[] = [];
        const stream = Readable.from(file.buffer);
        stream
          .pipe(csvParser())
          .on('data', (data: any) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err: any) => reject(err));
      });
    } else {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      return xlsx.utils.sheet_to_json(sheet);
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private async processRows(type: string, rows: any[]): Promise<{ okRows: number; errorRows: number; message: string }> {
    let okRows = 0;
    let errorRows = 0;
    let errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        if (type === 'users') {
          if (!row.user_code) throw new Error(`Row ${i+2}: User Code is mandatory`);
          if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i+2}: Invalid email format`);

          await this.prisma.grcUser.upsert({
            where: { user_code: row.user_code.toString() },
            update: {
              full_name: row.full_name?.toString() || row.user_code.toString(),
              email: row.email?.toString() || null,
              status: row.status === 'true' || row.status === true || row.status === 1,
              source_system: row.source_system?.toString() || null,
            },
            create: {
              user_code: row.user_code.toString(),
              full_name: row.full_name?.toString() || row.user_code.toString(),
              email: row.email?.toString() || null,
              status: true,
              source_system: row.source_system?.toString() || null,
              institutionId: '',
            },
          });
        }
        else if (type === 'roles') {
          if (!row.role_name) throw new Error(`Row ${i+2}: Role Name is mandatory`);

          await this.prisma.grcRole.upsert({
            where: { role_name: row.role_name.toString() },
            update: {
              role_desc: row.role_desc?.toString() || null,
              process_area: row.process_area?.toString() || null,
              criticality: row.criticality?.toString() || 'Medium',
              status: row.status !== undefined ? (row.status === 'true' || row.status === true || row.status === 1 || row.status === '1') : undefined,
            },
            create: {
              role_name: row.role_name.toString(),
              role_desc: row.role_desc?.toString() || null,
              process_area: row.process_area?.toString() || null,
              criticality: row.criticality?.toString() || 'Medium',
              status: row.status !== undefined ? (row.status === 'true' || row.status === true || row.status === 1 || row.status === '1') : true,
              institutionId: '',
            },
          });
        }
        else if (type === 'assignments') {
          if (!row.user_code || !row.role_name) throw new Error(`Row ${i+2}: user_code and role_name are required`);

          const user = await this.prisma.grcUser.findUnique({ where: { user_code: row.user_code.toString() } });
          const role = await this.prisma.grcRole.findUnique({ where: { role_name: row.role_name.toString() } });

          if (!user) throw new Error(`Row ${i+2}: User ${row.user_code} not found`);
          if (!role) throw new Error(`Row ${i+2}: Role ${row.role_name} not found`);

          await this.prisma.grcUserRole.create({
            data: {
              id_user: user.id_user,
              id_role: role.id_role,
              assigned_at: row.assigned_at ? new Date(row.assigned_at) : undefined, // Let DB default work
              valid_from: row.valid_from ? new Date(row.valid_from) : null,
              valid_to: row.valid_to ? new Date(row.valid_to) : null,
              status: row.status !== undefined ? (row.status === 'true' || row.status === true || row.status === 1 || row.status === '1') : true,
              institutionId: '',
            }
          });
        }
        else if (type === 'risk-rules') {
          if (!row.rule_code || !row.rule_name) throw new Error(`Row ${i+2}: rule_code and rule_name are mandatory`);

          await this.prisma.grcRiskRule.upsert({
            where: { rule_code: row.rule_code.toString() },
            update: {
              rule_name: row.rule_name.toString(),
              rule_type: row.rule_type?.toString() || 'Segregation of Duties',
              risk_level: row.risk_level?.toString() || 'Medium',
              description: row.description?.toString() || null,
              mitigation_text: row.mitigation_text?.toString() || null,
              active_flag: row.active_flag !== undefined
                ? (row.active_flag === 'true' || row.active_flag === true || row.active_flag === 1 || row.active_flag === '1')
                : undefined,
            },
            create: {
              rule_code: row.rule_code.toString(),
              rule_name: row.rule_name.toString(),
              rule_type: row.rule_type?.toString() || 'Segregation of Duties',
              risk_level: row.risk_level?.toString() || 'Medium',
              description: row.description?.toString() || null,
              mitigation_text: row.mitigation_text?.toString() || null,
              active_flag: row.active_flag !== undefined
                ? (row.active_flag === 'true' || row.active_flag === true || row.active_flag === 1 || row.active_flag === '1')
                : true,
              institutionId: '',
            },
          });
        }
        else if (type === 'rule-items') {
          if (!row.rule_code || !row.object_type || !row.object_value) {
            throw new Error(`Row ${i+2}: rule_code, object_type and object_value are mandatory`);
          }

          const rule = await this.prisma.grcRiskRule.findUnique({
            where: { rule_code: row.rule_code.toString() },
          });
          if (!rule) throw new Error(`Row ${i+2}: Risk Rule '${row.rule_code}' not found — upload the rule first`);

          const seqNo = row.seq_no ? parseInt(row.seq_no.toString(), 10) : (
            await this.prisma.grcRuleItem.count({ where: { id_rule: rule.id_rule } }) + 1
          );

          // Incremental: skip if identical item already exists
          const existing = await this.prisma.grcRuleItem.findFirst({
            where: { id_rule: rule.id_rule, object_type: row.object_type.toString(), object_value: row.object_value.toString() },
          });
          if (!existing) {
            await this.prisma.grcRuleItem.create({
              data: {
                id_rule: rule.id_rule,
                object_type: row.object_type.toString(),
                object_value: row.object_value.toString(),
                seq_no: seqNo,
              },
            });
          }
        }
        else if (type === 'role-transactions') {
          if (!row.role_name || !row.object || !row.field || !row.transaction) {
            throw new Error(`Row ${i+2}: role_name, object, field, and transaction are required`);
          }

          const role = await this.prisma.grcRole.findUnique({ where: { role_name: row.role_name.toString() } });
          if (!role) throw new Error(`Row ${i+2}: Role ${row.role_name} not found`);

          const existingTrx = await this.prisma.grcRoleTrx.findFirst({
            where: {
              role_name: row.role_name.toString(),
              object: row.object.toString(),
              field: row.field.toString(),
              transaction: row.transaction.toString(),
            }
          });

          if (!existingTrx) {
            await this.prisma.grcRoleTrx.create({
              data: {
                role_name: row.role_name.toString(),
                object: row.object.toString(),
                field: row.field.toString(),
                transaction: row.transaction.toString(),
                institutionId: '',
              }
            });
          }
        }
        okRows++;
      } catch (err: any) {
        this.logger.warn(`Row ${i+2} error: ${err.message}`);
        errors.push(err.message);
        errorRows++;
      }
    }

    return {
      okRows,
      errorRows,
      message: errors.length > 0 
        ? `Processed ${okRows} successfully. Failures: ${errors.slice(0, 5).join('; ')}${errors.length > 5 ? '...' : ''}`
        : `Processed ${okRows} successfully.`
    };
  }
}
