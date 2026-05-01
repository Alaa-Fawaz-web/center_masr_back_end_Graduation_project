import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleEnumDto } from 'src/validators/roles.dto';
import GetAllPostsDto from './dto/getAllPosts.dto';
import { roleTeacherAndCenterSet, sendResponsive } from 'src/utils';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        likeCounts: true,
        commentCounts: true,
        createdAt: true,
        likes: {
          where: { userId },
          select: {
            id: true,
          },
          take: 1,
        },
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    const { likes, ...reset } = post;
    return sendResponsive(
      {
        ...reset,
        isLiked: post.likes.length > 0,
      },
      'Post retrieved successfully',
    );
  }

  async getAllPosts(filters: GetAllPostsDto, userId: string, page = 1) {
    const limit = 6;

    const posts = await this.prisma.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      skip: (+page - 1) * limit,
      take: limit,

      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        likeCounts: true,
        commentCounts: true,
        createdAt: true,
        likes: {
          where: { userId },
          select: {
            id: true,
          },
          take: 1,
        },
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return sendResponsive(
      {
        meta: {
          total: posts.length,
          page,
        },
        data: posts.map((post) => {
          const { likes, ...reset } = post;
          return {
            ...reset,
            isLiked: post.likes.length > 0,
          };
        }),
      },
      'Posts retrieved successfully',
    );
  }
  async createPost(
    dataPostsDto: CreatePostDto,
    userId: string,
    role: RoleEnumDto,
  ) {
    if (!roleTeacherAndCenterSet.has(role))
      throw new ForbiddenException('Only teacher or center can create posts');

    return this.prisma.$transaction(async (prisma) => {
      const [newPost] = await Promise.all([
        prisma.post.create({
          data: {
            ...dataPostsDto,
            userId,
            role,
          },
        }),

        prisma.user.update({
          where: { id: userId },
          data: {
            postCounts: { increment: 1 },
          },
        }),
      ]);

      return sendResponsive(newPost, 'Post created successfully');
    });
  }
  async updatePost(postId: string, userId: string, data: UpdatePostDto) {
    const result = await this.prisma.post.update({
      where: {
        id_userId: {
          id: postId,
          userId,
        },
      },
      data,
    });

    return sendResponsive(null, 'Post updated successfully');
  }

  async deletePost(postId: string, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      await Promise.all([
        prisma.post.delete({
          where: { id_userId: { id: postId, userId } },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            postCounts: {
              decrement: 1,
            },
          },
        }),
      ]);

      return sendResponsive(null, 'Post deleted successfully');
    });
  }
}
