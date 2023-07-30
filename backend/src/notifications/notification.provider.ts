import { Injectable, Inject } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketProvider {
  constructor(@Inject('SOCKET_IO') private readonly server: Server) {}

  emit(event: string, data: any) {
    this.server.emit(event, data);
  }
}
