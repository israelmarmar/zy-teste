import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

export default async function sendSubscribers(
  topicId: number,
  server: Server,
  content: string,
) {
  const socketId = (
    await prisma.topic.findFirst({
      include: {
        creator: true,
      },
      where: { id: topicId },
    })
  ).creator.socketId;

  const subscriptions =
    (await prisma.subscription.findMany({
      include: {
        user: true,
        topic: true,
      },
      where: { topicId },
    })) || [];

  console.log(subscriptions);

  if (server.sockets.sockets.get(socketId))
    server.sockets.sockets
      .get(socketId)
      .emit(`notify-topicId-${topicId}`, content);

  subscriptions.forEach((s) => {
    if (server.sockets.sockets.get(s?.user?.socketId)) {
      console.log(s?.user?.socketId);
      server.sockets.sockets
        .get(s?.user?.socketId)
        .emit(`notify-topicId-${topicId}`, content);
    }
  });
}
