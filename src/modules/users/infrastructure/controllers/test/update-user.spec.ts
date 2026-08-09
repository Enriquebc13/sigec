import { UserController } from "../user.controller";
import {
  createUserControllerTestingModule,
  mockUpdateUserUseCase,
} from "./user-controller.test-setup";

describe("UserController - update", () => {
  let controller: UserController;

  beforeEach(async () => {
    controller = await createUserControllerTestingModule();
  });

  it("Debe llamar a UpdateUserUseCase con el id y los datos a actualizar", async () => {
    const updateUserDto = { name: "Enrique Updated" };
    const updatedUser = {
      id: "1",
      name: "Enrique Updated",
      lastname: "Baez",
      email: "enrique@gmail.com",
    };

    mockUpdateUserUseCase.execute.mockResolvedValue(updatedUser);

    const result = await controller.update("1", updateUserDto as any);

    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith("1", updateUserDto);
    expect(result).toEqual(updatedUser);
  });
});