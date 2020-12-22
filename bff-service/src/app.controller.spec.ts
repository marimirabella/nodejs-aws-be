import { HttpModule, HttpService } from '@nestjs/common';
import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let httpService;

  beforeEach(async () => {
    httpService = {
      request: () => ({ toPromise: () => ({ data: 'cart' }) }),
    };

    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should send response according to the requested service request and method', async () => {
      process.env.cart = 'cart-url';
      const req = { originalUrl: '/cart', method: 'GET' } as Request;
      const body = {};
      const res = { json: jest.fn() } as unknown as Response;

      await appController.getRecipient(req, body, res)

      expect(res.json).toHaveBeenCalledWith('cart');
    });
  });
});
