import { IsIn } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsIn(['APPROVED', 'REJECTED'], {
    message: 'El status debe ser APPROVED o REJECTED',
  })
  status!: 'APPROVED' | 'REJECTED';
}