import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { EchoModule } from '@/echo/echo.module';
import { GreeterUpdate } from '@/greeter/greeter.update';

@Module({
    imports: [
        ConfigModule.forRoot(),

        EchoModule,
        TelegrafModule,
    ],
    providers: [
        {
            provide: 'greeterBot',
            useFactory: (configService: ConfigService) => {
                const bot = new Telegraf(configService.get<string>('TELEGRAM_BOT_TOKEN'));
                return bot;
            },
            
            inject: [ConfigService],
        },

        GreeterUpdate,
    ],
    exports: ['greeterBot'],
})
export class GreeterModule {}
