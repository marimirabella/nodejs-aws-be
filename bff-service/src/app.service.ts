import { Injectable, HttpService } from '@nestjs/common';
import { Request } from 'express';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  private readonly cache: Map<string, any>;

  constructor(private httpService: HttpService) {
    this.cache = new Map();
  }

  async getRecipient(
    { originalUrl, method }: Request,
    body,
  ): Promise<AxiosResponse> {
    console.log('original url', originalUrl);
    console.log('method', method);
    console.log('body', body);

    const [, recipient] = originalUrl.split('/');

    const recipientUrl = process.env[recipient];

    console.log('recipient url', recipientUrl);

    if (recipientUrl) {
      try {
        const bodyExists = Boolean(Object.keys(body || {}).length);
        const axiosConfig = {
          method,
          url: `${recipientUrl}${originalUrl}`,
          ...(bodyExists && { data: body }),
        } as AxiosRequestConfig;

        const response = await this.httpService
          .request(axiosConfig)
          .toPromise();

        if (originalUrl === '/products' && method === 'GET') {
          if (this.cache.has('products')) {
            const [products, timestamp] = this.cache.get('products');

            if ((Date.now() - timestamp) / 1000 / 60 <= 2) {
              return products;
            }
          }

          this.cache.set('products', [response.data, Date.now()]);
        }

        return response.data;
      } catch (err) {
        if (err.response) {
          throw { status: err.response.status, message: err.response.data };
        }

        throw { status: 500, message: err.message };
      }
    } else {
      throw { status: 502, message: 'Cannot process request' };
    }
  }
}
