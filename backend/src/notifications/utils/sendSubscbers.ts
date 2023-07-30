import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

export default async function sendSubscribers(
  topicId: number,
  server: Server,
  content: string,
) {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
      topic: true,
    },
    where: { topicId },
  });

  const creator = await prisma.user.findFirst({
    where: { id: subscriptions[0]?.topic.creatorId },
  });

  server.sockets.sockets
    .get(creator.socketId)
    .emit(`notify-topicId-${topicId}`, content);

  subscriptions.forEach((s) => {
    if (s.user.socketId)
      server.sockets.sockets
        .get(s.user.socketId)
        .emit(`notify-topicId-${topicId}`, content);
  });
}
