import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';

const prisma = new PrismaClient();

@Injectable()
export class SubscriptionsService {
  async create(createSubscriptionDto: CreateSubscriptionDto, user: User) {
    try {
      const topic = await prisma.topic.findFirst({
        where: { id: createSubscriptionDto.topicId },
      });

      if (topic['creatorId'] === user.id)
        throw new HttpException(
          'Usuário já é autor do tópico',
          HttpStatus.UNAUTHORIZED,
        );

      const subscription = await prisma.subscription.findFirst({
        where: { topicId: createSubscriptionDto.topicId, userId: user.id },
      });

      if (!subscription) {
        try {
          const data = await prisma.subscription.create({
            data: {
              topicId: createSubscriptionDto.topicId,
              userId: user.id,
            },
          });

          return data;
        } catch (e) {
          throw new HttpException(
            'Usuário ou tópico não existente',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else
        throw new HttpException(
          'Usuário já inscrito neste tópico',
          HttpStatus.UNAUTHORIZED,
        );
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
