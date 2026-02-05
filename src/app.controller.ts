import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async getHello() {
    return 'Hello World!';
  }
  @Get("/hello")
  async getHelloNew() {
    return 'Hello World new!';
  }

  @Get("/test-new")
  async getTestNEW() {
    return 'Пробую! цей роут';
  }

  @Get("/test")
  async getTest() {
    return 'Пробую! ';
  }

  @Post('invoice')
  async generateInvoice(
    @Res() res: Response,
    @Body()
    body: {
      customerName: string;
      items: { name: string; quantity: number; price: number }[];
    },
  ) {
    const data = {
      customerName: body.customerName,
      date: new Date().toISOString().split('T')[0],
      items: body.items,
      total: 500,
    };

    const pdfBuffer = await this.appService.generateInvoice(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.end(pdfBuffer);
  }

  @Post('invoice-base64')
  async generateInvoiceTest(
    @Res() res: Response,
    @Body()
    body: {
      customerName: string;
      items: { name: string; quantity: number; price: number }[];
    },
  ) {
    const data = {
      customerName: body.customerName,
      date: new Date().toISOString().split('T')[0],
      items: body.items,
      total: 500,
    };

    const pdfBuffer = await this.appService.generateInvoiceBase64(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.end(pdfBuffer);
  }
    

}
