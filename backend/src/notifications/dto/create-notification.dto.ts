export class CreateNotificationDto {
  content: string;
  topicId: number;

  constructor(content: string, topicId: number) {
    this.content = content;
    this.topicId = topicId;
  }
}
