import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import { FollowerService } from './follower.service';

@Controller('followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post(':targetUserId')
  toggleFollowUser(
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
    @Req() req,
  ) {
    return this.followerService.toggleFollowUser(req.user.userId, targetUserId);
  }
}
