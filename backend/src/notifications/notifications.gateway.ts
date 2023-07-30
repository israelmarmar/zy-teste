import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('servidor socket.io iniciado');
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(client: any, payload: any): Promise<void> {
    const { token } = payload;

    if (!token) {
      this.server.emit('authenticated', { message: 'Cliente não autenticado' });
      return client.disconnect(true);
    }

    const { userId }: any = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: { socketId: client.id },
      });
      this.server.emit('authenticated', { message: 'Você está autenticado!' });
    } else {
      console.log('Cliente não autenticado:', client.id);
      // Negar a conexão com o cliente não autenticado
      this.server.emit('authenticated', { message: 'Cliente não autenticado' });
      client.disconnect(true);
    }
  }
}
