import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import AuthDecorator from 'src/decorator/auth.decorator';
import { GetAllChatIdDto } from './dato/get.message.dto';
import { ConversationService } from './Conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @AuthDecorator()
  @Post()
  createConversation(@Body() getAllChatIdDto: GetAllChatIdDto) {
    return this.conversationService.createConversation(
      getAllChatIdDto.senderId,
      getAllChatIdDto.receiverId,
    );
  }

  @Get('')
  getAllConversation(@Req() req) {
    return this.conversationService.getAllConversation(req.user.userId);
  }
}
