import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator.js';
import { TelegramImportService } from './telegram-import.service.js';

type TelegramUpdate = {
  channel_post?: Parameters<TelegramImportService['handleChannelPost']>[0];
};

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramImportService: TelegramImportService) {}

  @Public()
  @Post('webhook')
  handleWebhook(
    @Body() update: TelegramUpdate,
    @Headers('x-telegram-bot-api-secret-token') secret?: string,
  ) {
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      throw new UnauthorizedException();
    }

    if (update.channel_post) {
      // Respond to Telegram immediately; processing (including the media-group
      // debounce) continues in the background.
      this.telegramImportService.handleChannelPost(update.channel_post);
    }

    return { ok: true };
  }
}
