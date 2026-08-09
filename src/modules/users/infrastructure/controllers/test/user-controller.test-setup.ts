import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { CreateUserUseCase } from "../../../application/use-cases/create-user.use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/get-all-users.use-case";
import { GetUserByIdUseCase } from "../../../application/use-cases/find-user-by-id.use-case";
import { UpdateUserUseCase } from "../../../application/use-cases/update-user.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/delete-user.use-case";

export const mockCreateUserUseCase = {
  execute: jest.fn(),
};
export const mockGetAllUsersUseCase = {
  execute: jest.fn(),
};
export const mockGetUserByIdUseCase = {
  execute: jest.fn(),
};
export const mockUpdateUserUseCase = {
  execute: jest.fn(),
};
export const mockDeleteUserUseCase = {
  execute: jest.fn(),
};

export async function createUserControllerTestingModule(): Promise<UserController> {
  jest.clearAllMocks();

  const module: TestingModule = await Test.createTestingModule({
    controllers: [UserController],
    providers: [
      { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
      { provide: GetAllUsersUseCase, useValue: mockGetAllUsersUseCase },
      { provide: GetUserByIdUseCase, useValue: mockGetUserByIdUseCase },
      { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
      { provide: DeleteUserUseCase, useValue: mockDeleteUserUseCase },
    ],
  }).compile();
  return module.get<UserController>(UserController);
}