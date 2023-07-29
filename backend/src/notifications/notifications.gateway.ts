import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private notificationsService: NotificationsService) {}

  async handleConnection(socket: Socket) {
    await this.notificationsService.getUserFromSocket(socket);
  }

  // listen for send_message events
  @SubscribeMessage('create_notify')
  async listenForMessages(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.notificationsService.getUserFromSocket(socket);

    this.server.sockets.emit('receive_notify', {
      message,
    });
  }
}
