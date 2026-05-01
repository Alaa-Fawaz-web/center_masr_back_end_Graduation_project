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

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts(
    @Query('page', ParseIntPipe) page: number,
    @Query() getAllPostsDto: GetAllPostsDto,
    @Req() req,
  ) {
    const { userId } = req.user as RequestType;
    console.log(userId);

    return this.postService.getAllPosts(getAllPostsDto, userId, page);
  }

  @Get(':postId')
  getPost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req: any) {
    return this.postService.getPost(postId, req.user.userId);
  }

  @RolesDecorator(TEACHER, CENTER)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const { userId, role } = req.user as RequestType;

    return this.postService.createPost(createPostDto, userId, role);
  }

  @RolesDecorator(TEACHER, CENTER)
  @Patch(':postId')
  updatePost(
    @Param('postId', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    return this.postService.updatePost(id, req.user.userId, updatePostDto);
  }

  @RolesDecorator(TEACHER, CENTER)
  @Delete(':postId')
  deletePost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req) {
    return this.postService.deletePost(postId, req.user.userId);
  }
}
