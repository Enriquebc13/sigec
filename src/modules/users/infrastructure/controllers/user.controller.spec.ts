import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { GetAllUsersUseCase } from "../../application/use-cases/get-all-users.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";
import { GetUserByIdUseCase } from "../../application/use-cases/find-user-by-id.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";
import { User } from "../../domain/entities/user.entity";



describe('UsersController', () => {
    let controller: UserController;

    const mockGetUserUseCase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const mockCreateUserUseCase = {
            execute: jest.fn(),
        };

        const mockGetUsersUseCase = {
            execute: jest.fn(),
        };

        const mockUpdateUserUseCase = {
            execute: jest.fn(),
        };

        const mockDeleteUserUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: CreateUserUseCase,
                    useValue: mockCreateUserUseCase,
                },
                {
                    provide: GetAllUsersUseCase,
                    useValue: mockGetUsersUseCase,
                },
                {
                    provide: UpdateUserUseCase,
                    useValue: mockUpdateUserUseCase,
                },
                {
                    provide: GetUserByIdUseCase,
                    useValue: mockGetUserUseCase,
                },
                {
                    provide: DeleteUserUseCase,
                    useValue: mockDeleteUserUseCase,
                },

            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('El controlador debe estar definido', () => {
        expect(controller).toBeDefined();
    });

    //Verificar que se tenga una instancia de GetPropertyUseCase
    it('Debe tener instancia de GetUserUseCase', () => {
        expect(mockGetUserUseCase).toBeDefined();
    });

    //caso de prueba:
    //-->> El controlador en su metodo findOne(id: string) retorne un objeto
    //User, con la misma estructura que devuelve el
    //GetUserUseCase.execute(id: string)

    describe("Interaccion entre el controlador y caso de uso", () => {

        it("Debe devolver un usuario por ID", async () => {

            //Ejemplo de estructura de usuario(objeto User)
            let user: User = {
                id: "asdasd",
                email: "Admin@gmail.com",
                name: "Admin",
                lastname: "Perez",
                password: "12345678",
                role: "ADMIN",
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };


            //indicar que la simulacion del usecase devolvera un objeto user
            //(el objeto previamente definido)
            mockGetUserUseCase.execute.mockResolvedValue(user)

            //ejecutar el controlador
            const result = await controller.findOne('asdasd');

            //comparar la respuesta obtenida desde el controlador
            expect(result).toEqual(user);
            //desde el caso de uso
            expect(mockGetUserUseCase.execute)
                .toHaveBeenCalledWith('asdasd')
        });
    });

});