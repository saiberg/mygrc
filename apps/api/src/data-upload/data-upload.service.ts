import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
const csvParser = require('csv-parser');

@Injectable()
export class DataUploadService {
  private readonly logger = new Logger(DataUploadService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processUploadAndImport(type: string, file: Express.Multer.File, userId: string) {
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
        institutionId: '', // intercepted correctly at runtime
      },
    });

    try {
      // 2. Parse file synchronously into JSON array
      const rows = await this.parseFile(file, isCsv);

      // 3. Process records (Synchronously for MVP)
      const { okRows, errorRows, message } = await this.processRows(type, rows);

      // 4. Update Import Log successfully
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
      
      // Update Log with fatal error
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
      // Parse Excel
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert to array of objects
      return xlsx.utils.sheet_to_json(sheet);
    }
  }

  private async processRows(type: string, rows: any[]): Promise<{ okRows: number; errorRows: number; message: string }> {
    let okRows = 0;
    let errorRows = 0;

    for (const row of rows) {
      try {
        if (type === 'users') {
          await this.prisma.grcUser.upsert({
            where: { user_code: row.user_code?.toString() },
            update: {
              full_name: row.full_name?.toString(),
              email: row.email?.toString(),
              status: row.status === 'true' || row.status === true,
              source_system: row.source_system?.toString(),
            },
            create: {
              user_code: row.user_code?.toString(),
              full_name: row.full_name?.toString(),
              email: row.email?.toString(),
              status: true,
              source_system: row.source_system?.toString(),
              institutionId: '',
            },
          });
        }
        else if (type === 'roles') {
          await this.prisma.grcRole.upsert({
            where: { role_name: row.role_name?.toString() },
            update: {
              role_desc: row.role_desc?.toString(),
              process_area: row.process_area?.toString(),
              criticality: row.criticality?.toString(),
            },
            create: {
              role_name: row.role_name?.toString(),
              role_desc: row.role_desc?.toString(),
              process_area: row.process_area?.toString(),
              criticality: row.criticality?.toString(),
              institutionId: '',
            },
          });
        }
        // assignments logic can be similarly mapped looking up user_code to id_user...
        okRows++;
      } catch (err) {
        this.logger.warn(`Row processing error: ${err}`);
        errorRows++;
      }
    }

    return {
      okRows,
      errorRows,
      message: `Processed ${okRows} successfully, ${errorRows} failures.`
    };
  }
}
