import { OmitType } from '@nestjs/mapped-types';
import BaseDataUserDto from 'src/validators/baseDataUser.dto';

export default class SignUpAuthDto extends OmitType(BaseDataUserDto, [
  'phone',
]) {}
