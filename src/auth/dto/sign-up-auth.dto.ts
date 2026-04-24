import { OmitType } from '@nestjs/swagger';
import BaseDataUserDto from 'src/validators/baseDataUser.dto';

export default class SignUpAuthDto extends OmitType(BaseDataUserDto, [
  'address',
  'phone',
]) {}
