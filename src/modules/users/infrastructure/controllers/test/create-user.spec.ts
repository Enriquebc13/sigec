import { UserController } from "../user.controller";
import {
  createUserControllerTestingModule,
  mockCreateUserUseCase,
} from "./user-controller.test-setup";

describe("UserController - create", () => {
  let controller: UserController;

  beforeEach(async () => {
    controller = await createUserControllerTestingModule();
  });

  it("El controlador debe estar definido", () => {
    expect(controller).toBeDefined();
  });

  it("Debe llamar a CreateUserUseCase y retornar el usuario creado", async () => {
    const createUserDto = {
      name: "Enrique",
      lastname: "Baez",
      email: "enrique@gmail.com",
    };

    const createdUser = { id: "1", ...createUserDto };

    mockCreateUserUseCase.execute.mockResolvedValue(createdUser);

    const result = await controller.create(createUserDto as any);

    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createdUser);
  });
});