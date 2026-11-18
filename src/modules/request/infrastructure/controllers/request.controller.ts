import { Controller, Post, Body, Request, UseGuards, Get, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { CreateRequestDto } from '../../application/dtos/create-request.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { GetAllRequestHistoryUseCase } from '../../application/use-cases/get-all-request-history.use-case';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { GetMyRequestsUseCase } from '../../application/use-cases/get-my-requests.use-case';
import { UpdateRequestStatusDto } from '../../application/dtos/update-request-status.dto';
import { UpdateRequestStatusUseCase } from '../../application/use-cases/update-request-status.use-case';
import { DeleteRequestUseCase } from '../../application/use-cases/delete-request.use-case';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RequestEntity } from '../../domain/entities/request.entity';
import { GetAllRequestsUseCase } from '../../application/use-cases/get-all-requests.use-case';
import { ListRequestsQueryDto } from '../../application/dtos/list-requests-query.dto';
import { AdminRequestResponseDto } from '../../application/dtos/request-response.dto';
import { CancelRequestUseCase } from '../../application/use-cases/cancel-request.use-case';
import { UpdateRequestPhoneUseCase } from '../../application/use-cases/update-request-phone.use-case';
import { UpdateRequestPhoneDto } from '../../application/dtos/update-request-phone.dto';

@ApiBearerAuth() //todo controlador requiere JWT
@ApiTags("Solicitudes")

@Controller('requests')
export class RequestController {
  constructor(
    private readonly createRequestUseCase: CreateRequestUseCase,
    private readonly getAllRequestHistoryUseCase: GetAllRequestHistoryUseCase,
    private readonly getMyRequestsUseCase: GetMyRequestsUseCase,
    private readonly updateRequestStatusUseCase: UpdateRequestStatusUseCase,
    private readonly deleteRequestUseCase: DeleteRequestUseCase,
    private readonly getAllRequestsUseCase: GetAllRequestsUseCase,
    private readonly cancelRequestUseCase: CancelRequestUseCase,
    private readonly updateRequestPhoneUseCase: UpdateRequestPhoneUseCase,
  ) { }

@ApiOperation({ summary: "Registra nueva solicitud"})
@ApiCreatedResponse({ type: RequestEntity}) // el tipo de retorno

  // @Public()
  // @Post()
  // async create(@Body() createRequestDto: CreateRequestDto) {
  //   return await this.createRequestUseCase.execute(createRequestDto);
  // }
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateRequestDto,
    @Request() req
  ) {
    console.log(`Nueva solcitud creada por:`, req.user);
    return this.createRequestUseCase.execute(
      dto,
      req.user.userId
    );
  }


  // Panel admin: todas las solicitudes, o las de una propiedad con ?propertyId=
  // (ej. GET /requests?propertyId=abc&status=PENDING desde el detalle del inmueble)
  @ApiOperation({ summary: "Listado de solicitudes (ADMIN), filtrable por propertyId y status" })
  @ApiOkResponse({ type: [AdminRequestResponseDto], description: "Solicitudes con solicitante, propiedad y posicionListaEspera" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(@Query() query: ListRequestsQueryDto) {
    return this.getAllRequestsUseCase.execute(query);
  }

   //agregamso esto para el historial
   @ApiOperation({summary: "Historial de solicitudes"})
   @ApiOkResponse({ type: [RequestEntity], description: "Listado de todas las solicitudes" })
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('ADMIN')
   @Get('history')
   async getHistory() {
     return this.getAllRequestHistoryUseCase.execute();
   }


    @ApiOperation({summary: "Obtener solicitud"})
    @ApiOkResponse({ type: [RequestEntity], description: "Solicitudes del usuario autenticado" })
    @UseGuards(JwtAuthGuard)
    @Get('my-requests')
    async getMyRequests(@Request() req) {
      return this.getMyRequestsUseCase.execute(req.user.userId);
    }



//agregar lo mismo para actualizar
  @ApiOperation({summary: "Actualiza una solicitud"})
  @ApiParam({
    type: "string",
    name: "id",
    description: "id de la solicitud"
  })
  @ApiOkResponse({ type: RequestEntity, description: "Solicitud actualizada correctamente" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
    @Request() req,
  ) {
    return this.updateRequestStatusUseCase.execute(id, dto.status, req.user.userId);
  }


  // El solicitante cancela su solicitud PENDING (sale de la lista de espera)
  @ApiOperation({ summary: "Cancela una solicitud pendiente (solo su dueño)" })
  @ApiParam({ type: "string", name: "id", description: "id de la solicitud" })
  @ApiOkResponse({ description: "Solicitud cancelada; queda REJECTED con cancelledByApplicant: true" })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    return this.cancelRequestUseCase.execute(id, req.user.userId);
  }

  // El solicitante corrige su teléfono (PENDING o APPROVED)
  @ApiOperation({ summary: "Edita el teléfono de una solicitud (solo su dueño)" })
  @ApiParam({ type: "string", name: "id", description: "id de la solicitud" })
  @ApiOkResponse({ description: "Solicitud con el teléfono actualizado" })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/phone')
  async updatePhone(
    @Param('id') id: string,
    @Body() dto: UpdateRequestPhoneDto,
    @Request() req,
  ) {
    return this.updateRequestPhoneUseCase.execute(id, dto.telefono, req.user.userId);
  }

  //agregamso esto parael delete
  @ApiOperation({summary: "Elimina una solicitud"})
  @ApiOkResponse({ description: "Solicitud eliminada correctamente (sin contenido en la respuesta)" })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.deleteRequestUseCase.execute(id, req.user.userId);
  }
}