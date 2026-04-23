import { Module } from '@nestjs/common';
import { RiskMatrixController } from './risk-matrix.controller';
import { RiskMatrixService } from './risk-matrix.service';

@Module({
  controllers: [RiskMatrixController],
  providers: [RiskMatrixService],
})
export class RiskMatrixModule {}
