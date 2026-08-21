import { Controller, Post, Body, Request, UseGuards, Get, Patch, Param, Delete } from '@nestjs/common';
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
    console.log(req.user);
    return this.createRequestUseCase.execute(
      dto,
      req.user.userId
    );
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