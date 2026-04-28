import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  ParseUUIDPipe,
  ParseEnumPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { GetAllUsersDto } from './dto/getAllUsersDto';
import { ProfileService } from 'src/utils/methods_handler';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';
import QueryPageDto from 'src/validators/queryPageDto';
import { UpdateUserDto } from './dto/updateUser.dto';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,

    private ProfileService: ProfileService,
  ) {}

  @AuthDecorator()
  @Get()
  getAllUsers(
    @Body() getAllUsersDto: GetAllUsersDto,
    @Query() queryPageDto: QueryPageDto,
  ) {
    return this.usersService.getAllUsers(getAllUsersDto, queryPageDto.page);
  }

  @Get(':id')
  getUser(
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @Query('role', new ParseEnumPipe(RoleTeacherAndCenterDto))
    role: string,
    @Req() req,
  ) {
    return this.usersService.getUserById(targetUserId, role, req?.user?.userId);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    if (req.user.role !== updateUserDto.role)
      throw new BadRequestException('You can not change your role');
    if (req.user.userId !== userId) throw new BadRequestException('');

    const { userData, profileData, extraProfileData } =
      this.ProfileService.buildProfileData(req.user.role, updateUserDto);
    return this.usersService.updateUser(
      req.user.userId,
      updateUserDto.role!,
      userData,
      profileData,
      extraProfileData,
    );
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseUUIDPipe) userId: string, @Req() req) {
    return this.usersService.deleteUser(req.user.userId);
  }
}
