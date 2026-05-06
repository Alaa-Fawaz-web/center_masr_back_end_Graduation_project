import { Injectable } from '@nestjs/common';
import { CreateCenterDashboardDto } from './dto/create-center-dashboard.dto';
import { UpdateCenterDashboardDto } from './dto/update-center-dashboard.dto';

@Injectable()
export class CenterDashboardService {
  create(createCenterDashboardDto: CreateCenterDashboardDto) {
    return 'This action adds a new centerDashboard';
  }

  findAll() {
    return `This action returns all centerDashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} centerDashboard`;
  }

  update(id: number, updateCenterDashboardDto: UpdateCenterDashboardDto) {
    return `This action updates a #${id} centerDashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} centerDashboard`;
  }
}
