import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TopicsModule } from './topics/topics.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    UsersModule,
    TopicsModule,
    SubscriptionsModule,
    NotificationsModule,
    NotificationsGateway,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
