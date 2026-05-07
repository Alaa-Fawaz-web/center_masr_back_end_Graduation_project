import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(userId: string, postId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      const wasLiked = !!existingLike;
      const isNowLiked = !wasLiked;

      if (wasLiked) {
        await prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
      } else {
        await prisma.like.create({
          data: {
            userId,
            postId,
          },
        });
      }

      await prisma.post.update({
        where: { id: postId },
        data: {
          likeCounts: {
            increment: isNowLiked ? 1 : -1,
          },
        },
      });

      return sendResponsive(
        { isLiked: isNowLiked },
        `Post ${isNowLiked ? 'liked' : 'unliked'} successfully`,
      );
    });
  }
}
