import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import AuthDecorator from 'src/decorator/auth.decorator';
import { GetAllChatIdDto } from './dato/get.message.dto';
import { MessageService } from './Message.service';
import { CreateMessageDto } from './dato/create.message.dto';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // @AuthDecorator()
  // @Post()
  // createMessage(
  //   @Query() getAllMessagesDto: GetAllChatIdDto,
  //   @Body() createMessageDto: CreateMessageDto,
  // ) {
  //   return this.messageService.createMessage(
  //     getAllMessagesDto.senderId,
  //     getAllMessagesDto.receiverId,
  //     'getAllMessagesDto.conversationId',
  //     createMessageDto.content,
  //   );
  // }

  @AuthDecorator()
  @Get()
  getAllMessages(@Query() getAllMessagesDto: GetAllChatIdDto) {
    return this.messageService.getMessage(
      getAllMessagesDto.senderId,
      getAllMessagesDto.receiverId,
      getAllMessagesDto.page,
    );
  }
}
