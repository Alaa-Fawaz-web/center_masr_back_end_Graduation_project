import { Controller, Post, Req, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Toggle like' })
  @Post(':id')
  toggleLike(@Param('id') userId: string, @Req() req) {
    return this.likeService.toggleLike(req.user.userId, userId);
  }
}
