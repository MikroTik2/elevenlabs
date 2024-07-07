import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { GreeterUpdate } from '@/greeter/greeter.update';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule,
    ],
    providers: [
        {
            provide: 'greeterBot',
            useFactory: (configService: ConfigService) => {
                const bot = new Telegraf('6772463405:AAGlbQ8ioOXC70kmg8JaVgbkDBnKVzroIr0');
                return bot;
            },
            inject: [ConfigService],
        },

        GreeterUpdate,
    ],
    exports: ['greeterBot'],
})
export class GreeterModule {}
