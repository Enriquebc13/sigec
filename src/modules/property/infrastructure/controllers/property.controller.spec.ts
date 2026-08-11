import { Test, TestingModule } from "@nestjs/testing";
import { PropertyController } from "./property.controller";
import { CreatePropertyUseCase } from "../../application/use-cases/create-property.use-case";
import { GetPropertyUseCase } from "../../application/use-cases/get-property.use-case";
import { UpdatePropertyUseCase } from "../../application/use-cases/update-property.use-case";
import { GetAllPropertiesUseCase } from "../../application/use-cases/get-all-properties.use-case";
import { Property } from "../../domain/entities/property.entity";
import { PropertyStatus, PropertyType } from "generated/prisma/enums";
import { DeletePropertyUseCase } from "../../application/use-cases/delete-property.use-case";



describe('PropertiesController', () => {
    let controller: PropertyController;

    const mockGetPropertyUseCase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const mockCreatePropertyUseCase = {
            execute: jest.fn(),
        };

        const mockGetPropertiesUseCase = {
            execute: jest.fn(),
        };

        const mockUpdatePropertyUseCase = {
            execute: jest.fn(),
        };

        const mockDeletePropertyUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PropertyController],
            providers: [
                {
                    provide: CreatePropertyUseCase,
                    useValue: mockCreatePropertyUseCase,
                },
                {
                    provide: GetAllPropertiesUseCase,
                    useValue: mockGetPropertiesUseCase,
                },
                {
                    provide: UpdatePropertyUseCase,
                    useValue: mockUpdatePropertyUseCase,
                },
                {
                    provide: GetPropertyUseCase,
                    useValue: mockGetPropertyUseCase,
                },
                {
                    provide: DeletePropertyUseCase,
                    useValue: mockDeletePropertyUseCase,
                },

            ],
        }).compile();

        controller = module.get<PropertyController>(PropertyController);
    });

    it('El controlador debe estar definido', () => {
        expect(controller).toBeDefined();
    });

    //Verificar que se tenga una instancia de GetPropertyUseCase
    it('Debe tener instancia de GetPropertyUseCase', () => {
        expect(mockGetPropertyUseCase).toBeDefined();
    });

    //caso de prueba:
    //-->> El controlador en su metodo findOne(id: string) retorne un objeto
    //Property, con la misma estructura que devuelve el
    //GetPropertyUseCase.execute(id: string)

    describe("Interaccion entre el controlador y caso de uso", () => {

        it("Debe devolver una propiedad por ID", async () => {

            //Ejemplo de estructura de propiedad(objeto Propiedad)
            let property: Property = {
                id: "asdasd",
                title: "Local comercial céntrico",
                description: "Excelente ubicación",
                price: 15000,
                maintenanceCost: 500,
                dimensions: "80m2",
                floor: 1,
                type: PropertyType.LOCAL,
                status: PropertyStatus.AVAILABLE,
                amenities: "baño, estacionamiento",
                userId: "user-456",
                createdAt: new Date(),
                updatedAt: null,

            }

            //indicar que la simulacion del usecase devolvera un objeto property
            //(el objeto previamente definido)
            mockGetPropertyUseCase.execute.mockResolvedValue(property)

            //ejecutar el controlador
            const result = await controller.findOne('asdasd');

            //comparar la respuesta obtenida desde el controlador
            expect(result).toEqual(property);
            //desde el caso de uso
            expect(mockGetPropertyUseCase.execute)
                .toHaveBeenCalledWith('asdasd')
        });
    });

});