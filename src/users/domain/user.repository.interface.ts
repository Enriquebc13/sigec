//Aqui van las acciones que el sistema debe poder hacer con los usuarios
import { User } from './user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>; 
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}