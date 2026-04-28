import { IsEnum, IsUUID } from 'class-validator';
import { roleTeacherAndCenter } from 'src/utils/constant';
import { Trim } from 'src/validators/is-in-set.validator';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';

class GetAllPostsDto {
  @IsUUID()
  userId!: string;

  @Trim()
  @IsEnum(roleTeacherAndCenter)
  role!: RoleTeacherAndCenterDto;
}

export default GetAllPostsDto;
