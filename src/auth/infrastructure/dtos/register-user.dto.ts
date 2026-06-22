export class RegisterUserDto {
  name!: string;
  lastname!: string;
  email!: string;
  password!: string;
  role!: 'ADMIN' | 'CLIENT';
} 