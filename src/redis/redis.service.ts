// // redis.service.ts
// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisService implements OnModuleInit, OnModuleDestroy {
//   public pub: Redis;
//   public sub: Redis;

//   constructor() {
//     this.pub = new Redis();
//     this.sub = new Redis();
//   }

//   // =============================
//   // 📤 Publish
//   // =============================
//   async publish(channel: string, data: any) {
//     await this.pub.publish(channel, JSON.stringify(data));
//   }

//   // =============================
//   // 📥 Subscribe (normal)
//   // =============================
//   async subscribe(channel: string, callback: (data: any) => void) {
//     await this.sub.subscribe(channel);

//     this.sub.on('message', (ch, msg) => {
//       if (ch === channel) {
//         callback(JSON.parse(msg));
//       }
//     });
//   }

//   // =============================
//   // 🔥 Pattern Subscribe (chat:*)
//   // =============================
//   async psubscribe(
//     pattern: string,
//     callback: (channel: string, data: any) => void,
//   ) {
//     await this.sub.psubscribe(pattern);

//     this.sub.on('pmessage', (pat, channel, msg) => {
//       if (pat === pattern) {
//         callback(channel, JSON.parse(msg));
//       }
//     });
//   }

//   // =============================
//   // 🟢 Presence (online/offline)
//   // =============================
//   async setOnline(userId: string) {
//     await this.pub.set(`online:${userId}`, '1', 'EX', 60);
//   }

//   async setOffline(userId: string) {
//     await this.pub.del(`online:${userId}`);
//   }

//   async isOnline(userId: string) {
//     const res = await this.pub.get(`online:${userId}`);
//     return !!res;
//   }

//   // =============================
//   // ❤️ Heartbeat
//   // =============================
//   async heartbeat(userId: string) {
//     await this.pub.set(`online:${userId}`, '1', 'EX', 60);
//   }

//   // =============================
//   // 🧹 Cleanup
//   // =============================
//   async onModuleInit() {
//     console.log('✅ Redis Connected');
//   }

//   async onModuleDestroy() {
//     await this.pub.quit();
//     await this.sub.quit();
//   }
// }
// redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  pub: Redis;
  sub: Redis;

  constructor() {
    this.pub = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
    this.sub = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

    this.pub.on('error', (err) =>
      console.log('❌ Redis PUB Error:', err.message),
    );

    this.sub.on('error', (err) =>
      console.log('❌ Redis SUB Error:', err.message),
    );
  }

  async publish(channel: string, data: any) {
    await this.pub.publish(channel, JSON.stringify(data));
  }

  async subscribe(channel: string, callback: (data: any) => void) {
    await this.sub.subscribe(channel);

    this.sub.on('message', (ch, msg) => {
      if (ch === channel) {
        callback(JSON.parse(msg));
      }
    });
  }
}
