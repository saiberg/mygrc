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
              email: row.email?.toString() || '',
              status: row.status === 'true' || row.status === true || row.status === 1,
              source_system: row.source_system?.toString(),
            },
            create: {
              user_code: row.user_code.toString(),
              full_name: row.full_name?.toString() || row.user_code.toString(),
              email: row.email?.toString() || '',
              status: true,
              source_system: row.source_system?.toString(),
              institutionId: '',
            },
          });
        }
        else if (type === 'roles') {
          if (!row.role_name) throw new Error(`Row ${i+2}: Role Name is mandatory`);

          await this.prisma.grcRole.upsert({
            where: { role_name: row.role_name.toString() },
            update: {
              role_desc: row.role_desc?.toString(),
              process_area: row.process_area?.toString() || 'General',
              criticality: row.criticality?.toString() || 'Medium',
            },
            create: {
              role_name: row.role_name.toString(),
              role_desc: row.role_desc?.toString(),
              process_area: row.process_area?.toString() || 'General',
              criticality: row.criticality?.toString() || 'Medium',
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
              valid_from: row.valid_from ? new Date(row.valid_from) : new Date(),
              valid_to: row.valid_to ? new Date(row.valid_to) : null,
              institutionId: '',
            }
          });
        }
        else if (type === 'risk-rules') {
          if (!row.rule_code || !row.rule_name) throw new Error(`Row ${i+2}: rule_code and rule_name are mandatory`);

          const rule = await this.prisma.grcRiskRule.upsert({
            where: { rule_code: row.rule_code.toString() },
            update: {
              rule_name: row.rule_name.toString(),
              rule_type: row.rule_type?.toString() || 'Segregation of Duties',
              risk_level: row.risk_level?.toString() || 'Medium',
              description: row.description?.toString() || '',
            },
            create: {
              rule_code: row.rule_code.toString(),
              rule_name: row.rule_name.toString(),
              rule_type: row.rule_type?.toString() || 'Segregation of Duties',
              risk_level: row.risk_level?.toString() || 'Medium',
              description: row.description?.toString() || '',
              institutionId: '',
            },
          });

          // If object info is provided, add it as a Rule Item
          if (row.object_type && row.object_value) {
            const itemCount = await this.prisma.grcRuleItem.count({ where: { id_rule: rule.id_rule } });
            await this.prisma.grcRuleItem.create({
              data: {
                id_rule: rule.id_rule,
                object_type: row.object_type.toString(),
                object_value: row.object_value.toString(),
                seq_no: itemCount + 1,
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
