import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetAllLessonDto } from 'src/lesson/dto/getAllLessonDto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { TEACHER } from 'src/utils';
import QueryDto from 'src/validators/query.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  findAll(
    @Query() queryDto: QueryDto,
    @Query() getAllNoteDto: GetAllLessonDto,
    @Req() req,
  ) {
    return this.noteService.findAll(
      queryDto,
      req.user.profileId,
      getAllNoteDto.title,
    );
  }

  @Get(':noteId')
  findOne(@Param('noteId', ParseUUIDPipe) noteId: string, @Req() req) {
    return this.noteService.findOne(noteId, req.user.profileId);
  }

  @RolesDecorator(TEACHER)
  @Post(':lessonId')
  create(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    // @Query('courseId', ParseUUIDPipe) courseId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Req() req,
  ) {
    return this.noteService.create(
      req.user.profileId,
      lessonId,
      // courseId,
      createNoteDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Patch(':noteId')
  update(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Req() req,
  ) {
    return this.noteService.update(noteId, req.user.profileId, createNoteDto);
  }

  @RolesDecorator(TEACHER)
  @Delete(':noteId')
  remove(@Param('noteId', ParseUUIDPipe) noteId: string, @Req() req) {
    return this.noteService.remove(noteId, req.user.profileId);
  }
}
