// Usuarios simulados 
// password real para ambos en las pruebas: 12345678
const HASHED_PASSWORD =
  '$2b$10$VkgisqnDQNBfsbILSZIIuOILYh7jT3e9oRXufd8gY5CxNEFQmLegK';

export const adminUser = {
  id: 'admin-test-id',
  name: 'Admin',
  lastname: 'Test',
  email: 'admin.test@sigec.com',
  password: HASHED_PASSWORD,
  role: 'ADMIN',
  active: true,
  createdAt: new Date(),
  updatedAt: null,
};

export const clientUser = {
  id: 'client-test-id',
  name: 'Cliente',
  lastname: 'Test',
  email: 'client.test@sigec.com',
  password: HASHED_PASSWORD,
  role: 'CLIENT',
  active: true,
  createdAt: new Date(),
  updatedAt: null,
};

export const mockProperty = {
  id: 'property-1',
  title: 'Local comercial céntrico',
  description: 'Excelente ubicación',
  price: 15000,
  maintenanceCost: 500,
  dimensions: '80m2',
  floor: 1,
  type: 'LOCAL',
  status: 'AVAILABLE',
  amenities: 'baño, estacionamiento',
  userId: adminUser.id,
  createdAt: new Date(),
  updatedAt: null,
  address: {
    id: 'address-1',
    street: 'Av. Reforma 123',
    city: 'Izúcar de Matamoros',
    state: 'Puebla',
    zipCode: '74400',
    propertyId: 'property-1',
  },
};