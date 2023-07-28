import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [NotificationsController],
  providers: [JwtService, NotificationsService],
})
export class NotificationsModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly rabbitMQService: NotificationsService) {}

  async onModuleInit() {
    await this.rabbitMQService.connect();
  }

  async onModuleDestroy() {
    await this.rabbitMQService.close();
  }
}
