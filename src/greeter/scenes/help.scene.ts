import { Scene, SceneEnter } from 'nestjs-telegraf';
import { EchoService } from '@/echo/echo.service';

import { phrases } from 'libs/locales/phrases';

import { IContext } from '@/interfaces/context.interface';

@Scene('HELP_SCENE_ID')
export class HelpScene {
     
     constructor(
          private readonly echoService: EchoService,
     ) {};

     @SceneEnter()
     async help(ctx: IContext) {
          await this.echoService.replyOrEdit({ text: phrases.help }, ctx);
     };
};