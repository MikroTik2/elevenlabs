import { TelegrafModuleOptions, TelegrafModuleAsyncOptions } from "nestjs-telegraf";
import { sessionMiddleware } from "@/middleware/session.middleware";
import { GreeterModule } from '@/greeter/greeter.module';
import { EchoModule } from '@/echo/echo.module';
import { ConfigService } from "@nestjs/config";

const telegramModuleOptions = (config: ConfigService): TelegrafModuleOptions =>  {
     return {
          token: config.get<string>("TELEGRAM_BOT_TOKEN"),
          middlewares: [sessionMiddleware],
          include: [GreeterModule, EchoModule],
     };
};

export const options = (): TelegrafModuleAsyncOptions => {
     return {
          useFactory: (config: ConfigService) => telegramModuleOptions(config),
          inject: [ConfigService],
     };
};