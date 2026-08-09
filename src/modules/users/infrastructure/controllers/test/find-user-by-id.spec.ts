import { UserController } from "../user.controller";
import {
  createUserControllerTestingModule,
  mockGetUserByIdUseCase,
} from "./user-controller.test-setup";

describe("UserController - findOne", () => {
  let controller: UserController;

  beforeEach(async () => {
    controller = await createUserControllerTestingModule();
  });

  it("Debe tener definida la instancia del caso de uso", () => {
    expect(mockGetUserByIdUseCase).toBeDefined();
  });

  it("Debe llamar a GetUserByIdUseCase y retornar un usuario por su id", async () => {
    const user = {
      id: "1",
      name: "Enrique",
      lastname: "Baez",
      email: "enrique@gmail.com",
    };

    mockGetUserByIdUseCase.execute.mockResolvedValue(user);

    const result = await controller.findOne("1");

    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith("1");
    expect(result).toEqual(user);
  });
});