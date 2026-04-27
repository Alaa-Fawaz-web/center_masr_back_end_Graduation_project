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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import RolesDecorator from 'src/decorator/roles.decorator';


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,

    private ProfileService: ProfileService,
  ) {}

  @ApiOperation({ summary: 'Get all users' })
   @AuthDecorator()
  @Get()
  getAllUsers(
    @Body() getAllUsersDto: GetAllUsersDto,
    @Query() queryPageDto: QueryPageDto,
  ) {
    return this.usersService.getAllUsers(getAllUsersDto, queryPageDto.page);
  }

  @RolesDecorator()
  @ApiOperation({ summary: 'Get user' })
  @Get(':id')
  getUser(
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @Query('role', new ParseEnumPipe(RoleTeacherAndCenterDto))
    role: string,
    @Req() req,
  ) {
    return this.usersService.getUserById(targetUserId, role, req?.user?.userId);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch('')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    if (req.user.role !== updateUserDto.role)
      throw new BadRequestException('You can not change your role');

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

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':userId')
  deleteUser(@Param('userId', ParseUUIDPipe) userId: string, @Req() req) {
    return this.usersService.deleteUser(req.user.userId);
  }
}
