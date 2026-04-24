import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import GetAllPostsDto from './dto/getAllPosts.dto';
import { RequestType } from 'src/types/type';
import { CreatePostDto } from './dto/createPost.dto';
import { CENTER, TEACHER } from 'src/utils';
import { UpdatePostDto } from './dto/updatePost.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  getAllPosts(
    @Body() getAllPostsDto: GetAllPostsDto,
    @Query('page', ParseIntPipe) page: number,
    @Req() req,
  ) {
    const { userId } = req.user as RequestType;

    return this.postService.getAllPosts(getAllPostsDto, userId, page);
  }

  @ApiOperation({ summary: 'Get post' })
  @Get(':postId')
  getPost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req: any) {
    return this.postService.getPost(postId, req.user.userId);
  }

  @ApiOperation({ summary: 'Create post' })
  @RolesDecorator(TEACHER, CENTER)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const { userId, role } = req.user as RequestType;

    return this.postService.createPost(createPostDto, userId, role);
  }

  @ApiOperation({ summary: 'Update post' })
  @RolesDecorator(TEACHER, CENTER)
  @Patch(':postId')
  updatePost(
    @Param('postId', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    return this.postService.updatePost(id, req.user.userId, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @RolesDecorator(TEACHER, CENTER)
  @Delete(':postId')
  deletePost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req) {
    return this.postService.deletePost(postId, req.user.userId);
  }
}
