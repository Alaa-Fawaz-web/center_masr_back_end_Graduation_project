import { Module } from '@nestjs/common';
import { CenterDashboardService } from './center-dashboard.service';
import { CenterDashboardController } from './center-dashboard.controller';

@Module({
  controllers: [CenterDashboardController],
  providers: [CenterDashboardService],
})
export class CenterDashboardModule {}
