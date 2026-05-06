import { PartialType } from '@nestjs/swagger';
import { CreateCenterDashboardDto } from './create-center-dashboard.dto';

export class UpdateCenterDashboardDto extends PartialType(CreateCenterDashboardDto) {}
