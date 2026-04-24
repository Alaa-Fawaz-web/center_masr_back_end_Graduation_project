import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('followers')
@Controller('followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @ApiOperation({ summary: 'Follow user' })
  @Post(':targetUserId')
  toggleFollowUser(
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
    @Req() req,
  ) {
    return this.followerService.toggleFollowUser(req.user.userId, targetUserId);
  }
}
