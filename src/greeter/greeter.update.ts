import { Command, Ctx, Help, Start, Update, Action } from 'nestjs-telegraf';
import { EchoService } from '@/echo/echo.service';
import { IContext } from '@/interfaces/context.interface';
import { phrases } from 'libs/locales/phrases';

@Update()
export class GreeterUpdate {

     constructor(
          private readonly echoService: EchoService,
     ) {};

     @Start()
     async onStart(@Ctx() ctx: IContext) {
          await this.echoService.sendMessage({
               text:  `👋 Привет - <b>${ctx.from.first_name}</b>! Я бот, который может конвертировать текст в речь с использованием продвинутой AI модели. Введи текст, и я озвучу его для тебя.`,
               ...this.echoService.createSimpleInlineKeyboard([
                    [{ text: 'Получить все голоса', callback_data: '/voices' }],
                    [{ text: 'Убрать шус с видео', callback_data: '/video' }],
               ]),
          }, ctx);
     };

     @Help()
     async onHelp(@Ctx() ctx: IContext) {
          await ctx.replyWithHTML(phrases.help);
     };

     @Action('/voices')
     @Command('voices')
     async onSceneCommand(@Ctx() ctx: IContext): Promise<void> {
          await ctx.scene.enter('VOICE_SCENE_ID');
     };

     @Action('/video')
     @Command('video')
     async onVideoCommand(@Ctx() ctx: IContext): Promise<void> {
          await ctx.scene.enter('VIDEO_SCENE_ID');
     };

     
     @Command('wizard')
     async onWizardCommand(@Ctx() ctx: IContext): Promise<void> {
          await ctx.scene.enter('WIZARD_SCENE_ID');
     };
};