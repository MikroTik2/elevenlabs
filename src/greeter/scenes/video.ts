import { Scene, SceneEnter, On, Action, Ctx, Message } from 'nestjs-telegraf';
import { ApiService } from '@/api/api.service';
import { IContext } from '@/interfaces/context.interface';

@Scene('VIDEO_SCENE_ID')
export class GetAllVideo {

     constructor(
          private readonly apiService: ApiService,
     ) {};

     @SceneEnter()
     async onSceneEnter(@Ctx() ctx: IContext) {
          await ctx.replyWithHTML('video scene');
     };

     @Action('leave')
     async onLeaveCommand(@Ctx() ctx: IContext) {
          await ctx.scene.leave();

          await ctx.replyWithHTML(`
<b>Вы можете использовать следующие команды:</b>

/start - начать использование бота,
/help - написать про ошибку,
/voices - выбрать голос для преобразования текста в аудио,
/video - выполнить операции с видео файлами.
          `)
          
     };
};