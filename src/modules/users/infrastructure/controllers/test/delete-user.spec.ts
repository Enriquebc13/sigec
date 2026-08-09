import { UserController } from "../user.controller";
import {
  createUserControllerTestingModule,
  mockDeleteUserUseCase,
} from "./user-controller.test-setup";

describe("UserController - remove", () => {
  let controller: UserController;

  beforeEach(async () => {
    controller = await createUserControllerTestingModule();
  });

  it("Debe llamar a DeleteUserUseCase con el id especificado", async () => {
    const deleteResult = { message: "Usuario eliminado correctamente" };

    mockDeleteUserUseCase.execute.mockResolvedValue(deleteResult);

    const result = await controller.remove("1");

    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith("1");
    expect(result).toEqual(deleteResult);
  });
});
