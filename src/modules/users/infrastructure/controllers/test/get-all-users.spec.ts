import { UserController } from "../user.controller";
import {
  createUserControllerTestingModule,
  mockGetAllUsersUseCase,
} from "./user-controller.test-setup";

describe("UserController - findAll", () => {
  let controller: UserController;

  beforeEach(async () => {
    controller = await createUserControllerTestingModule();
  });

  it("Debe llamar a GetAllUsersUseCase y retornar una lista de usuarios", async () => {
    const usersList = [
      { id: "1", name: "Enrique", lastname: "Baez", email: "enrique@gmail.com" },
      { id: "2", name: "Carlos", lastname: "Lopez", email: "carlos@gmail.com" },
    ];

    mockGetAllUsersUseCase.execute.mockResolvedValue(usersList);

    const result = await controller.findAll();

    expect(mockGetAllUsersUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(usersList);
  });
});