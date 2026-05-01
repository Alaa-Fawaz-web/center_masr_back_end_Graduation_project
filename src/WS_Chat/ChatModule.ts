import { Module } from '@nestjs/common';
import { ChatWsService } from './chatWsService';

@Module({
  providers: [ChatWsService],
})
export class ChatModule {}
