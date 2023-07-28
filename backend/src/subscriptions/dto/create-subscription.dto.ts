export class CreateSubscriptionDto {
  topicId: number;

  constructor(topicId: number) {
    this.topicId = topicId;
  }
}
