import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {

    //CASO DE PRUEBA
    //
    it('should return "Hello World!"', () => {
      // expect significa: lo que se espera que haga

      //toBe: deve ser lo siguiente ""
      expect(appController.getHello()).toBe('¡Hola Mundo!');
    });
  });
});
