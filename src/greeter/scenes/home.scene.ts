import { Scene, SceneEnter } from 'nestjs-telegraf';
import { EchoService } from '@/echo/echo.service';

import { phrases } from 'libs/locales/phrases';
import { buttons } from 'libs/locales/buttons';

import { IContext } from '@/interfaces/context.interface';

@Scene('HOME_SCENE_ID')
export class HomeScene {
     
     constructor(
          private readonly echoService: EchoService,
     ) {};

     @SceneEnter()
     async start(ctx: IContext) {
          await this.echoService.replyOrEdit({
               text: phrases.home(ctx.from.first_name),
               ...this.echoService.createSimpleInlineKeyboard([
                    [{ text: buttons.voice, callback_data: '/voices' }],
                    [{ text: buttons.video, callback_data: '/video' }],
               ], { columns: 1 }),
          }, ctx);
     };
};