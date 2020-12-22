import { Controller, All, Req, Body, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  async getRecipient(@Req() req: Request, @Body() body, @Res() res: Response) {
    try {
      const products = await this.appService.getRecipient(req, body);

      res.json(products);
    } catch (err) {
      const { status, message } = err;

      res.status(status).json({ error: message });
    }
  }
}
