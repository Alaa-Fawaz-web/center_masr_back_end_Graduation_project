import { Controller, Post, Req, Param } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':id')
  toggleLike(@Param('id') userId: string, @Req() req) {
    return this.likeService.toggleLike(req.user.userId, userId);
  }
}
