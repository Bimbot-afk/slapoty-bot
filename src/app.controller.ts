import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('slack/oauth_redirect')
  async slackRedirect(@Query('code') code: string): Promise<string> {
    if (!code) {
      return 'Path ready! Waiting for Slack authorization code.';
    }

    const clientId = process.env.SLACK_CLIENT_ID ?? '';
    const clientSecret = process.env.SLACK_CLIENT_SECRET ?? '';
    const redirectUri =
      process.env.SLACK_REDIRECT_URI ??
      'https://lather-exemption-character.ngrok-free.dev/slack/oauth_redirect';

    try {
      const response = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        return `Error Slack: ${data.error}`;
      }

      console.log('Slack token suscessfully');
      console.log('User id:', data.authed_user.id);
      console.log('User Token:', data.authed_user.access_token);

      return `Authentication suscessfully! Connected as user ${data.authed_user.id}. Check your terminal.`;
    } catch (error) {
      console.error(error);
      return 'Error processing Slack token.';
    }
  }
}