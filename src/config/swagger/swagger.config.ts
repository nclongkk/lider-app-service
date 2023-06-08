import type { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfigService } from '../config.service';

@Injectable()
export class SwaggerConfig {
  constructor(private configService: AppConfigService) {}

  public setupSwagger(app: INestApplication): void {
    if (this.configService.get('swagger.mode') === 'on') {
      // const swaggerUsername = this.configService.get('swagger.username');
      // const swaggerPassword = this.configService.get('swagger.password');
      // app.use(
      //   ['/v1/doc', '/v1/doc-json'],
      // basicAuth({
      //   challenge: true,
      //   users: {
      //     [swaggerUsername]: swaggerPassword,
      //   },
      // }),
      // );

      const config = new DocumentBuilder()
        .setTitle('Ecomdy Project API')
        .setDescription('The Ecomdy project APIs description')
        .setVersion('2.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('v1/doc', app, document, {
        swaggerOptions: { filter: true },
      });
    }
  }
}
