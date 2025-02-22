import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Invoice } from './dto/invoice';

@Injectable()
export class AppService {
  async generateInvoice(data: Invoice): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const htmlContent = this.generateTemplate(data);
    await page.setContent(htmlContent);
    const pdfBuffer = (await page.pdf({ format: 'A4' })) as Buffer;
    await browser.close();
    return pdfBuffer;
  }

  async generateInvoiceBase64(data: Invoice): Promise<string> {
    const pdfBuffer = await this.generateInvoice(data);
    return this.convertToBase64(pdfBuffer);
  }

  async convertToBase64(pdfBuffer: Buffer): Promise<string> {
    return pdfBuffer.toString('base64');
  }

  private generateTemplate(data: Invoice): string {
    return `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { font-size: 18px; font-weight: bold; }
          .total { font-size: 16px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid black; }
          th, td { padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">Накладна</div>
        <p>Покупець: ${data.customerName}</p>
        <p>Дата ${data.date}</p>
        <table>
          <tr>
            <th>Товар</th>
            <th>Кількість</th>
            <th>Ціна</th>
          </tr>
          ${data.items
            .map(
              (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
          </tr>`,
            )
            .join('')}
        </table>
        <p class="total">Загальна ціна: ${data.total}</p>
      </body>
      </html>
      `;
  }
}
