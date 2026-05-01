import { Module } from '@nestjs/common';
import { MessageService } from './Message.service';
import { ChatWsService } from './ChatWsService';
import { MessageController } from './Message.controller';
import { ConversationController } from './Conversation.controller';
import { ConversationService } from './Conversation.service';

@Module({
  controllers: [MessageController, ConversationController],
  providers: [ChatWsService, MessageService, ConversationService],
})
export class ChatModule {}
