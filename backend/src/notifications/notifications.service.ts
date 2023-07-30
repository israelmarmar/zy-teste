import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { NotificationsGateway } from './notifications.gateway';
import { v4 as uuidv4 } from 'uuid';
import sendSubscribers from './utils/sendSubscbers';

const prisma = new PrismaClient();

const user = process.env.RABBITMQ_USER;
const password = process.env.RABBITMQ_PASSWORD;
const host = process.env.RABBITMQ_HOST;

@Injectable()
export class NotificationsService {
  private socketServer: Server;
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly gateway: NotificationsGateway) {}

  async connect() {
    try {
      this.connection = await connect(`amqp://${user}:${password}@${host}`); // Substitua pela URL do seu servidor RabbitMQ
      this.channel = await this.connection.createChannel();

      const queueName = process.env.RABBITMQ_QUEUE_NAME; // Nome da fila que você deseja consumir

      this.consume(queueName, (message) => {
        if (message) {
          const content = message.content.toString();
          const { topicId } = JSON.parse(content);
          console.log(`notify-topicId-${topicId}`);
          //this.gateway.server.emit(`notify-topicId-${topicId}`, content);
          sendSubscribers(topicId, this.gateway.server, content);
        }
      });
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
    }
  }

  public async consume(
    queue: string,
    callback: (message: ConsumeMessage | null) => void,
  ) {
    try {
      if (this.channel) {
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.consume(queue, callback, { noAck: true });
      } else {
        await new Promise((r) => setTimeout(r, 2000));
        this.consume(queue, callback);
      }
    } catch (error) {
      console.error('Erro ao consumir mensagens:', error);
    }
  }

  async create(createNotificationDto: CreateNotificationDto, user: User) {
    try {
      if (this.channel) {
        const subscription = await prisma.subscription.findFirst({
          where: { topicId: createNotificationDto.topicId, userId: user.id },
        });

        const topic = await prisma.topic.findFirst({
          where: { id: createNotificationDto.topicId, creatorId: user.id },
        });

        if (!topic && !subscription)
          throw new HttpException(
            'Usuário não inscrito ou criador no tópico',
            HttpStatus.UNAUTHORIZED,
          );

        await this.channel.assertQueue(process.env.RABBITMQ_QUEUE_NAME, {
          durable: true,
        });
        await this.channel.sendToQueue(
          process.env.RABBITMQ_QUEUE_NAME,
          Buffer.from(
            JSON.stringify({
              username: user.username,
              uuid: uuidv4(),
              topicId: createNotificationDto.topicId,
              ...createNotificationDto,
            }),
          ),
        );
      } else {
        await new Promise((r) => setTimeout(r, 2000));
        this.create(createNotificationDto, user);
      }

      return { message: 'Mensagem enviada com sucesso!' };
    } catch (e) {
      throw e;
    }
  }

  async getUserFromSocket(socket: Socket) {
    let auth_token = socket.handshake.headers.authorization;
    auth_token = auth_token.split(' ')[1];

    const { userId }: any = await jwt.verify(
      auth_token,
      process.env.JWT_SECRET,
    );

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async close() {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (error) {
      console.error('Erro ao fechar conexão com o RabbitMQ:', error);
    }
  }
}
