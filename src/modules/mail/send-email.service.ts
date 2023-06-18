import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

import { AppConfigService } from '../../config/config.service';
import { MAIL_TEMPLATES } from './constants/mail.constants';

@Injectable()
export class SendEmailService {
  private transporter: nodemailer.Transporter;
  private readonly oauth2Client: OAuth2Client;
  constructor(private readonly configService: AppConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get('mail.clientId'),
      this.configService.get('mail.clientSecret'),
    );

    this.oauth2Client.setCredentials({
      refresh_token: this.configService.get('mail.refreshToken'),
    });
  }

  async sendEmail({
    to,
    subject,
    template,
    data,
  }: {
    to: string;
    subject: string;
    template: MAIL_TEMPLATES;
    data: any;
  }) {
    const accessToken = await this.oauth2Client.getAccessToken();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('mail.adminEmail'),
        clientId: this.configService.get('mail.clientId'),
        clientSecret: this.configService.get('mail.clientSecret'),
        refreshToken: this.configService.get('mail.refreshToken'),
        accessToken: accessToken,
      },
    });

    const html = await this.readEmailTemplate({ template, data });
    return await this.transporter.sendMail({
      from: this.configService.get('mail.adminEmail'),
      to,
      subject,
      html,
    });
  }

  async readEmailTemplate({
    template,
    data,
  }: {
    template: MAIL_TEMPLATES;
    data: any;
  }) {
    const pathReslove = path.resolve(__dirname, `./templates/${template}`);
    return ejs.renderFile(pathReslove, data);
  }
}
