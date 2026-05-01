import { IsUUID } from 'class-validator';
import QueryPageDto from 'src/validators/queryPageDto';

export class GetAllChatIdDto extends QueryPageDto {
  @IsUUID()
  senderId!: string;

  @IsUUID()
  receiverId!: string;
}
//   @IsUUID()
//   senderId!: string;

//   @IsUUID()
//   receiverId!: string;
// }
