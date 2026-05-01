// // import { Module } from '@nestjs/common';
// // import Redis from 'ioredis';

// // @Module({
// //   providers: [
// //     {
// //       provide: 'REDIS',
// //       useFactory: () => {
// //         return {
// //           pub: new Redis(),
// //           sub: new Redis(),
// //         };
// //       },
// //     },
// //   ],
// //   exports: ['REDIS'],
// // })
// // export class RedisModule {}

// // redis.module.ts
// import { Module } from '@nestjs/common';
// import { RedisService } from './redis.service';

// @Module({
//   providers: [RedisService],
//   exports: [RedisService], // 🔥 مهم جدًا
// })
// export class RedisModule {}
