import { Module } from '@nestjs/common';
import { DataUploadController } from './data-upload.controller';
import { DataUploadService } from './data-upload.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DataUploadController],
  providers: [DataUploadService],
})
export class DataUploadModule {}
