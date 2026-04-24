import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { roleTeacherAndCenter } from 'src/utils/constant';
import { Trim } from 'src/validators/is-in-set.validator';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';

class GetAllPostsDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @Trim()
  @IsEnum(roleTeacherAndCenter)
  role!: RoleTeacherAndCenterDto;
}

export default GetAllPostsDto;
