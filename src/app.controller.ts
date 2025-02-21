import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('invoice')
  async generateInvoice(@Res() res: Response, @Query() query: any) {
    const data = {
      customerName: query.customerName,
      date: new Date().toISOString().split('T')[0],
      items: [
        { name: 'Item 1', quantity: 1, price: 100 },
        { name: 'Item 2', quantity: 2, price: 200 },
      ],
      total: 500,
    };

    const pdfBuffer = await this.appService.generateInvoice(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.end(pdfBuffer);
  }
}
