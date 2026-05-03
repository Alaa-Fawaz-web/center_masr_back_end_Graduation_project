import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetAllUsersDto } from './dto/getAllUsersDto';
import {
  CENTER,
  roleTeacherAndCenterSet,
  sendResponsive,
  TEACHER,
} from 'src/utils';
import { ProfileDataType, UserDataType } from 'src/types/type';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // toUpperCase(str: string) {
  //   const data = str.slice(0, 1).toUpperCase() + str.slice(1);

  //   return `profile${data}`;
  // }
  async getUserById(
    targetUserId: string,
    role: string,
    currentUserId?: string,
  ) {
    const includeAndOmit = {
      include: true,
      omit: { userId: true },
    };

    if (!roleTeacherAndCenterSet.has(role))
      throw new BadRequestException('invalid Role, must be teacher or center');
    console.log(targetUserId, role, currentUserId);

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        [role]: includeAndOmit,
      },
      omit: { email: true, password: true, updatedAt: true },
    });

    if (!user || user.role !== role)
      throw new NotFoundException('User not found');

    let isFollowed = false;
    if (currentUserId) {
      const follow = await this.prisma.follower.findUnique({
        where: {
          followingId_followerId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
        select: { id: true },
      });

      isFollowed = !!follow;
    }

    return sendResponsive(
      {
        ...user,
        isFollowed,
        role,
      },
      'User retrieved successfully',
    );
  }

  async getAllUsersHomePage() {
    const [teachers, centers] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          role: Role.teacher,
          teacher: {
            isNot: null,
          },
        },
        take: 3,
        select: {
          id: true,
          name: true,
          imageUrl: true,

          teacher: {
            select: {
              id: true,
              classRoom: true,
              studyMaterial: true,
              star: true,
              experienceYear: true,
              studySystem: true,
              educationalStage: true,
              bio: true,
            },
          },
        },
      }),

      this.prisma.user.findMany({
        where: {
          role: Role.center,
          center: {
            isNot: null,
          },
        },
        take: 3,
        select: {
          id: true,
          name: true,
          imageUrl: true,

          center: {
            select: {
              id: true,
              educationalStage: true,
              governorate: true,
              studySystem: true,
              star: true,
              bio: true,
            },
          },
        },
      }),
    ]);

    return sendResponsive(
      { teachers, centers },
      'Home page data fetched successfully',
    );
  }
  // async getAllUsersHomePage() {
  //   const [teachers, centers] = await Promise.all([
  //     this.prisma.teacher.findMany({
  //       take: 3,
  //       select: {
  //         id: true,
  //         classRoom: true,
  //         studyMaterial: true,
  //         star: true,
  //         experienceYear: true,
  //         studySystem: true,
  //         educationalStage: true,
  //         bio: true,
  //         user: {
  //           select: {
  //             id: true,
  //             name: true,
  //             imageUrl: true,
  //           },
  //         },
  //       },
  //     }),

  //     this.prisma.center.findMany({
  //       take: 3,
  //       select: {
  //         id: true,
  //         educationalStage: true,
  //         governorate: true,
  //         studySystem: true,
  //         star: true,
  //         bio: true,
  //         user: {
  //           select: {
  //             id: true,
  //             name: true,
  //             imageUrl: true,
  //           },
  //         },
  //       },
  //     }),
  //   ]);

  //   return sendResponsive(
  //     { teachers, centers },
  //     'Home page data fetched successfully',
  //   );
  // }
  async getAllUsers(filters: GetAllUsersDto, page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const { role, name } = filters;

    const baseWhere: any = {
      role,
    };

    if (name) {
      baseWhere.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (role === TEACHER) {
      baseWhere.teacher = {
        ...(filters.classRoom && {
          classRoom: {
            has: filters.classRoom,
          },
        }),
        ...(filters.studyMaterial && {
          studyMaterial: {
            has: filters.studyMaterial,
          },
        }),
      };
    }

    if (role === CENTER) {
      baseWhere.center = {
        ...(filters.educationalStage && {
          educationalStage: {
            has: filters.educationalStage,
          },
        }),
        ...(filters.governorate && {
          governorate: {
            contains: filters.governorate,
            mode: 'insensitive',
          },
        }),
      };
    }

    const users = await this.prisma.user.findMany({
      where: baseWhere,
      select: {
        id: true,
        name: true,
        imageUrl: true,

        teacher:
          role === TEACHER
            ? {
                select: {
                  id: true,
                  classRoom: true,
                  studyMaterial: true,
                  star: true,
                  experienceYear: true,
                  studySystem: true,
                  educationalStage: true,
                  bio: true,
                },
              }
            : undefined,
        center:
          role === CENTER
            ? {
                select: {
                  id: true,
                  educationalStage: true,
                  governorate: true,
                  studySystem: true,
                  star: true,
                  bio: true,
                },
              }
            : undefined,
      },
      skip,
      take: limit,
    });
    console.log(users);

    return sendResponsive(users, 'Get All Users successfully');
  }

  async updateUser(
    id: string,
    role: Role,
    userData: UserDataType,
    profileData: ProfileDataType,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id },
        data: userData,
        select: { id: true },
      });

      await prisma[role].update({
        where: { userId: id },
        data: profileData as any,
        select: { id: true },
      });

      return sendResponsive(null, 'User updated successfully');
    });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return sendResponsive(null, 'User deleted successfully');
  }
}
