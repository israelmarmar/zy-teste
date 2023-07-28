import { Topic } from 'src/topics/entities/topic.entity';

export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  topics: Topic[];

  constructor(
    id: number,
    username: string,
    email: string,
    topics?: Topic[],
    password?: string,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.topics = topics;
  }
}
