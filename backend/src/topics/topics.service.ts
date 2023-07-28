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

  findAll() {
    return `This action returns all topics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
