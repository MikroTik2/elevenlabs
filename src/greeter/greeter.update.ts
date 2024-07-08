import { Command, Ctx, Help, Start, Update, Action } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { IContext } from '@/interfaces/context.interface';
import { UpdateType } from '@/common/decorators/update-type.decorator';

@Update()
export class GreeterUpdate {
     
     @Start()
     async onStart(@Ctx() ctx: IContext) {
          await ctx.replyWithHTML(`
               👋 Привет - <b>${ctx.from.first_name}</b>! Я бот, который может конвертировать текст в речь с использованием продвинутой AI модели. Введи текст, и я озвучу его для тебя.
          `, {
               reply_markup: {
                    inline_keyboard: [
                         [{ text: 'Получить все голоса', callback_data: '/voices' }],
                         [{ text: 'Убрать шус с видео', callback_data: '/video' }],
                    ],
               },
          });
     };

     @Help()
     async onHelp(@Ctx() ctx: IContext) {
          await ctx.replyWithHTML(`⁉️<b> Если у тебя есть проблемы.</b> \n✉️ <b>Напишите мне</b> <a href='https://t.me/d16ddd348'>@d16ddd348</a><b>.</b>`);
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
     
     // @Command('wizard')
     // async onWizardCommand(@Ctx() ctx: IContext): Promise<void> {
     //      await ctx.scene.enter('WIZARD_SCENE_ID');
     // };
};