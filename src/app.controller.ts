import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Ruta a la que responderá Slack tras autorizar
  @Get('slack/oauth_redirect')
  slackRedirect(@Query('code') code: string): string {
    if (!code) {
      return 'Ready, awaiting autorizathion slack code';
    }
    return `Code recived successfully: ${code}`;
  }
}