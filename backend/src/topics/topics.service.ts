import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { User } from 'src/users/entities/user.entity';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TopicsService {
  create(createTopicDto: CreateTopicDto, user: User) {
    try {
      return prisma.topic.create({
        data: {
          title: createTopicDto.title,
          creatorId: user.id,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async findAll(user: User) {
    const subscribedTopics = await prisma.subscription.findMany({
      where: {
        userId: user.id,
      },
      select: {
        topicId: true,
      },
    });

    const myTopics = await prisma.topic.findMany({
      where: {
        creatorId: user.id,
      },
    });

    const subscribedTopicIds = subscribedTopics.map(
      (subscription) => subscription.topicId,
    );

    const myTopicsTopicIds = myTopics.map((topic) => topic.id);

    const topicsWithoutSubscription = await prisma.topic.findMany({
      include: {
        creator: true,
      },
      where: {
        NOT: {
          id: {
            in: [...subscribedTopicIds, ...myTopicsTopicIds],
          },
        },
      },
    });

    return topicsWithoutSubscription;
  }

  async myFindAll(user: User) {
    const myTopics = await prisma.topic.findMany({
      include: {
        creator: true,
      },
      where: {
        creatorId: user.id,
      },
    });

    return myTopics;
  }

  findOne(id: number) {
    return prisma.topic.findFirst({
      where: { id },
    });
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
