import { UseFilters, UseInterceptors, Inject } from '@nestjs/common';
import { Help, On, Message, Start, Update, Ctx, Action } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { IContext } from '@/interfaces/context.interface';
import { ResponseTimeInterceptor } from '@/common/interceptors/response-time.interceptor';
import { TelegrafExceptionFilter } from '@/common/filters/telegraf-exception.filter';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class EchoUpdate {
    constructor(
        @Inject('greeterBot')
        private readonly bot: Telegraf<IContext>,
    ) {};

     
};