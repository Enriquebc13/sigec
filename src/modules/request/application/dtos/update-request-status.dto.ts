import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateRequestStatusDto {
  @ApiProperty({
    required: true,
    description: 'Nuevo estado de la solicitud',
    enum: ['APPROVED', 'REJECTED'],
  })
  @IsIn(['APPROVED', 'REJECTED'], {
    message: 'El status debe ser APPROVED o REJECTED',
  })
  status!: 'APPROVED' | 'REJECTED';
}