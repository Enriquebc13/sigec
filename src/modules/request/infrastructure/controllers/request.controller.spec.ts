import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RequestController } from './request.controller';
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { GetAllRequestHistoryUseCase } from '../../application/use-cases/get-all-request-history.use-case';
import { GetMyRequestsUseCase } from '../../application/use-cases/get-my-requests.use-case';
import { UpdateRequestStatusUseCase } from '../../application/use-cases/update-request-status.use-case';
import { DeleteRequestUseCase } from '../../application/use-cases/delete-request.use-case';

describe('RequestController', () => {
  let controller: RequestController;

  // Mocks que se pdiieron
  const mockCreateRequestUseCase = { execute: jest.fn() };
  const mockGetAllRequestHistoryUseCase = { execute: jest.fn() };
  const mockGetMyRequestsUseCase = { execute: jest.fn() };
  const mockUpdateRequestStatusUseCase = { execute: jest.fn() };
  const mockDeleteRequestUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        { provide: CreateRequestUseCase, useValue: mockCreateRequestUseCase },
        { provide: GetAllRequestHistoryUseCase, useValue: mockGetAllRequestHistoryUseCase },
        { provide: GetMyRequestsUseCase, useValue: mockGetMyRequestsUseCase },
        { provide: UpdateRequestStatusUseCase, useValue: mockUpdateRequestStatusUseCase },
        { provide: DeleteRequestUseCase, useValue: mockDeleteRequestUseCase },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
  });

  it('El controlador debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  //
  describe('create', () => {
    it('Flujo normal: debe crear una solicitud y devolverla', async () => {
      const dto = { telefono: '2221234567', propertyId: 'prop-1' };
      const req = { user: { userId: 'user-1' } };

      const expectedResponse = {
        id: 'req-1',
        telefono: dto.telefono,
        userId: 'user-1',
        propertyId: dto.propertyId,
        status: 'PENDING',
        createdAt: new Date(),
      };

      mockCreateRequestUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto as any, req);

      expect(result).toEqual(expectedResponse);
      expect(mockCreateRequestUseCase.execute).toHaveBeenCalledWith(dto, 'user-1');
    });
  });

  //
  describe('getHistory', () => {
    it('Flujo normal: debe devolver el historial completo de solicitudes', async () => {
      const expectedHistory = [
        { id: 'h1', action: 'CREATED', requestId: 'req-1', userId: 'user-1', changedAt: new Date() },
      ];

      mockGetAllRequestHistoryUseCase.execute.mockResolvedValue(expectedHistory);

      const result = await controller.getHistory();

      expect(result).toEqual(expectedHistory);
      expect(mockGetAllRequestHistoryUseCase.execute).toHaveBeenCalled();
    });
  });

  //
  describe('getMyRequests', () => {
    it('Flujo normal: debe devolver solo las solicitudes del usuario autenticado', async () => {
      const req = { user: { userId: 'user-1' } };
      const expectedRequests = [
        { id: 'req-1', telefono: '2221234567', userId: 'user-1', propertyId: 'prop-1', status: 'PENDING', createdAt: new Date() },
      ];

      mockGetMyRequestsUseCase.execute.mockResolvedValue(expectedRequests);

      const result = await controller.getMyRequests(req);

      expect(result).toEqual(expectedRequests);
      expect(mockGetMyRequestsUseCase.execute).toHaveBeenCalledWith('user-1');
    });
  });


  describe('updateStatus', () => {
    it('Flujo normal: debe actualizar el estatus de una solicitud existente', async () => {
      const dto = { status: 'APPROVED' as const };
      const req = { user: { userId: 'admin-1' } };

      const expectedResponse = {
        id: 'req-1',
        telefono: '2221234567',
        userId: 'user-1',
        propertyId: 'prop-1',
        status: 'APPROVED',
        createdAt: new Date(),
      };

      mockUpdateRequestStatusUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.updateStatus('req-1', dto as any, req);

      expect(result).toEqual(expectedResponse);
      expect(mockUpdateRequestStatusUseCase.execute).toHaveBeenCalledWith('req-1', 'APPROVED', 'admin-1');
    });

    it('Flujo anormal: debe propagar NotFoundException si la solicitud no existe', async () => {
      const dto = { status: 'APPROVED' as const };
      const req = { user: { userId: 'admin-1' } };

      mockUpdateRequestStatusUseCase.execute.mockRejectedValue(
        new NotFoundException('Solicitud req-x no encontrada'),
      );

      await expect(controller.updateStatus('req-x', dto as any, req)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------
  // DELETE /requests/:id -> delete
  // ---------------------------------------------------------------
  describe('delete', () => {
    it('Flujo normal: debe eliminar una solicitud propia sin errores', async () => {
      const req = { user: { userId: 'user-1' } };

      mockDeleteRequestUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.delete('req-1', req);

      expect(result).toBeUndefined();
      expect(mockDeleteRequestUseCase.execute).toHaveBeenCalledWith('req-1', 'user-1');
    });

    it('Flujo anormal: debe propagar NotFoundException si la solicitud no existe', async () => {
      const req = { user: { userId: 'user-1' } };

      mockDeleteRequestUseCase.execute.mockRejectedValue(
        new NotFoundException('Solicitud no encontrada'),
      );

      await expect(controller.delete('req-x', req)).rejects.toThrow(NotFoundException);
    });

    it('Flujo anormal: debe propagar ForbiddenException si el usuario no es dueño de la solicitud', async () => {
      const req = { user: { userId: 'user-2' } };

      mockDeleteRequestUseCase.execute.mockRejectedValue(
        new ForbiddenException('No tienes permiso para eliminar esta solicitud'),
      );

      await expect(controller.delete('req-1', req)).rejects.toThrow(ForbiddenException);
    });
  });
});