import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { PrismaModule } from './prisma/prisma.module';

import { MasterDataModule } from './master-data/master-data.module';
import { DataUploadModule } from './data-upload/data-upload.module';
import { RiskMatrixModule } from './risk-matrix/risk-matrix.module';
import { AnalysisEngineModule } from './analysis-engine/analysis-engine.module';
import { FindingsModule } from './findings/findings.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    PrismaModule,
    MasterDataModule,
    DataUploadModule,
    RiskMatrixModule,
    AnalysisEngineModule,
    FindingsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}
