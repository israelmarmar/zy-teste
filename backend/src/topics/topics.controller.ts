import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() request, @Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto, request['user']);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request) {
    return this.topicsService.findAll(request['user']);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  myFindAll(@Req() request) {
    return this.topicsService.myFindAll(request['user']);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
