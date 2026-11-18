import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from 'generated/prisma/enums';

/** Query params del listado administrativo: GET /requests?propertyId=&status= */
export class ListRequestsQueryDto {
  @ApiPropertyOptional({ description: 'Filtra por propiedad' })
  @IsOptional()
  @IsString()
  propertyId?: string;

  @ApiPropertyOptional({ enum: RequestStatus, description: 'Filtra por estado' })
  @IsOptional()
  @IsEnum(RequestStatus, { message: 'status debe ser PENDING, APPROVED o REJECTED' })
  status?: RequestStatus;
}
