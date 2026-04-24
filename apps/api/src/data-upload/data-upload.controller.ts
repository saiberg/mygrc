import { Controller, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DataUploadService } from './data-upload.service';

@ApiTags('Data Upload / Import')
@Controller('data-upload')
export class DataUploadController {
  constructor(private readonly dataUploadService: DataUploadService) {}

  @Post(':type')
  @ApiOperation({ summary: 'Upload an Excel or CSV file for mass import' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload (CSV or XLSX)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Query('mode') mode: 'incremental' | 'replace' = 'incremental'
  ) {
    if (!file) {
      throw new BadRequestException('A file must be provided');
    }

    const allowedTypes = ['users', 'roles', 'assignments', 'risk-rules'];
    if (!allowedTypes.includes(type)) {
      throw new BadRequestException(`Invalid import type. Allowed types are: ${allowedTypes.join(', ')}`);
    }

    // In a real scenario, this comes from the JWT payload
    const userId = req.user?.id || 'system-auditor';

    return this.dataUploadService.processUploadAndImport(type, file, userId, mode);
  }
}
