import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { roleTeacherAndCenterSet, sendResponsive } from 'src/utils';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async toggleFollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException("You can't follow yourself");
    }

    return this.prisma.$transaction(async (prisma) => {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, role: true },
      });

      if (!targetUser) throw new NotFoundException('User not found');

      if (!roleTeacherAndCenterSet.has(targetUser.role))
        throw new BadRequestException('Invalid role');

      const existingFollow = await prisma.follower.findUnique({
        where: {
          followingId_followerId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });

      const wasFollowing = !!existingFollow;
      const isNowFollowing = !wasFollowing;

      if (wasFollowing) {
        await prisma.follower.delete({
          where: {
            followingId_followerId: {
              followerId: currentUserId,
              followingId: targetUserId,
            },
          },
        });
      } else {
        await prisma.follower.create({
          data: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        });
      }

      await Promise.all([
        prisma.user.update({
          where: { id: targetUserId },
          data: {
            followerCounts: {
              increment: isNowFollowing ? 1 : -1,
            },
          },
        }),
        prisma.user.update({
          where: { id: currentUserId },
          data: {
            followingCounts: {
              increment: isNowFollowing ? 1 : -1,
            },
          },
        }),
      ]);

      return sendResponsive(
        { isFollowed: isNowFollowing },
        `User ${isNowFollowing ? 'followed' : 'unfollowed'} successfully`,
      );
    });
  }
}
