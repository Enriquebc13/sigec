import { Role } from "generated/prisma/enums";

export class UserDetailResponseDto{
    id!: string;
    name!: string;
    lastname!: string;
    email!: string;
    role!: Role;
    active!: boolean;
    createdAt!: Date;
    updatedAt?: Date | null;
}