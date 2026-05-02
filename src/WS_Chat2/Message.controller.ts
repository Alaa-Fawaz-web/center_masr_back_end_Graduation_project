import { Controller, Get, Query } from '@nestjs/common';
import AuthDecorator from 'src/decorator/auth.decorator';
import { GetAllChatIdDto } from './dato/get.message.dto';
import { MessageService } from './Message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

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
