export class RequestHistory {

  constructor(
    public readonly id: string,
    public readonly action: string,
    public readonly requestId: string,
    public readonly userId: string,
    public readonly changedAt: Date,
  ) {}

}