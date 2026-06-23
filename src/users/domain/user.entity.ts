
//Se definen que datos debe tener un objeto User
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly lastname: string,
    public readonly password: string,
    public readonly role: 'ADMIN' | 'CLIENT',
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }
}