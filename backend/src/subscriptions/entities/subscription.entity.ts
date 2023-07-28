import { Topic } from 'src/topics/entities/topic.entity';
import { User } from 'src/users/entities/user.entity';

export class Subscription {
  id: number;
  user: User;
  topic: Topic;

  constructor(id: number, user: User, topic: Topic) {
    this.id = id;
    this.user = user;
    this.topic = topic;
  }
}
