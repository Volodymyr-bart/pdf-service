import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async generateInvoice(data: any): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const htmlContent = `
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
        <div class="header">Invoice</div>
        <p>Customer: ${data.customerName}</p>
        <p>Date: ${data.date}</p>
        <table>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
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
        <p class="total">Total: ${data.total}</p>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' }) as Buffer;

    await browser.close();

    return pdfBuffer;
  }
}
