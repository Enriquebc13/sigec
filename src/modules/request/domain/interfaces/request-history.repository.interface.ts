import { RequestHistory } from '../entities/request-history.entity';

export interface IRequestHistoryRepository {
  create(history: RequestHistory): Promise<RequestHistory>;
  findAll(): Promise<RequestHistory[]>;
}