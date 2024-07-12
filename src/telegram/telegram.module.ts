import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';
import { EchoModule } from '@/echo/echo.module';
import { GreeterModule } from '@/greeter/greeter.module';

import { options } from '@/telegram/telegram-config.factory';

@Module({
     imports: [
          TelegrafModule.forRootAsync(options()),

          EchoModule,
          GreeterModule,
     ],
})

export class TelegramModule {};