import { User } from 'src/users/entities/user.entity';

export class Topic {
  id: number;
  title: string;
  creator: User;

  constructor(id: number, title: string, creator: User) {
    this.id = id;
    this.title = title;
    this.creator = creator;
  }
}
