import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':postId')
  getAllComments(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.commentService.getAllComments(postId);
  }

  @Post(':postId')
  createComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentService.createComment(
      req.user.userId,
      postId,
      createCommentDto.content,
    );
  }

  @Patch(':commentId')
  updateComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Query('postId', ParseUUIDPipe) postId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ) {
    return this.commentService.updateComment(
      req.user.userId,
      commentId,
      postId,
      updateCommentDto.content,
    );
  }

  @Delete(':commentId')
  deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Query('postId', ParseUUIDPipe) postId: string,
    @Req() req,
  ) {
    return this.commentService.deleteComment(
      req.user.userId,
      commentId,
      postId,
    );
  }
}
