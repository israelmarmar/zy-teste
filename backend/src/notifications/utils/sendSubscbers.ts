import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

export default async function sendSubscribers(
  topicId: number,
  server: Server,
  content: string,
) {
  const subscriptions =
    (await prisma.subscription.findMany({
      include: {
        user: true,
        topic: true,
      },
      where: { topicId },
    })) || [];

  console.log(subscriptions);

  const creator = await prisma.user.findFirst({
    where: { id: subscriptions[0]?.topic.creatorId },
  });

  console.log(creator);

  server.sockets.sockets
    .get(creator.socketId)
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
