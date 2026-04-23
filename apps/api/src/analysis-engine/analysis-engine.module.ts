import { Module } from '@nestjs/common';
import { AnalysisEngineController } from './analysis-engine.controller';
import { AnalysisEngineService } from './analysis-engine.service';

@Module({
  controllers: [AnalysisEngineController],
  providers: [AnalysisEngineService],
})
export class AnalysisEngineModule {}
