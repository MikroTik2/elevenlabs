import { Scene, SceneEnter, On, Action, Ctx, Message, Help, Start, Update } from 'nestjs-telegraf';
import { ApiService } from '@/api/api.service';
import { IContext } from '@/interfaces/context.interface';

@Scene('VOICE_SCENE_ID')
export class GetAllVoices {

     constructor(
          private readonly apiService: ApiService,
     ) {};

     @SceneEnter()
     async onSceneEnter(@Ctx() ctx: IContext) {
          await ctx.replyWithHTML('<code>Сообщение принял. Жду ответа от сервера!</code>');

          const api = await this.apiService.getVoices();

          const inlineKeyboard = api.voices.map((voice: any) => ({
               text: voice.name,
               callback_data: voice.voice_id.toString(),
          }));

          const chunks = [];
          for (let i = 0; i < inlineKeyboard.length; i += 4) {
               chunks.push(inlineKeyboard.slice(i, i + 4))
          };
          
          await ctx.reply('Теперь выбирите голос: ', {
               reply_markup: {
                    inline_keyboard: chunks,
               },
          });
     };

     @Action(/^[a-zA-Z0-9]{20}$/)
     async onVoiceCommand(@Ctx() ctx: IContext) {
          const id = ctx.callbackQuery?.['data']
          const api = await this.apiService.getVoiceId(id);
          
          await ctx.sendAudio({ url: api.preview_url, filename: api.name }, {
               caption: `
Имя: <code>${api.name}</code>,
Категория: <code>${api.category}</code>,
Акцент: <code>${api.labels.accent}</code>,
Пол: <code>${api.labels.gender}</code>,
Возраст: <code>${api.category}</code>,
               `, parse_mode: 'HTML',

               reply_markup: {
                    inline_keyboard: [
                         [{ text: 'Написать текст', callback_data: `text_speech_${api.voice_id}` }],
                         [{ text: 'Выйти на главную', callback_data: `leave` }],
                    ],
               }
          });
     };

     @Action(/text_speech_(.+)/)
     async onTextSpeech(@Ctx() ctx: IContext, @Message('text') message: any) {
          const voiceId = ctx?.['match'];
          ctx.session.__scenes.state = {'voiceId': voiceId[1]}

          await ctx.replyWithHTML('Отправьте текст, который хотите озвучить');
     };

     @On('text')
     async onText(@Ctx() ctx: IContext, @Message('text') message: any) {

          const voiceId = ctx.session.__scenes.state?.['voiceId'];

          if (message !== '/start' || '/help' || '/voices') {
               await ctx.scene.leave();

               await ctx.replyWithHTML(`
<b>Вы можете использовать следующие команды:</b>

/start - начать использование бота,
/help - написать про ошибку,
/voices - выбрать голос для преобразования текста в аудио,
/video - выполнить операции с видео файлами.
               `);
               return;
          };

          await ctx.replyWithHTML('<code>Сообщение принял. Жду ответа от сервера!</code>');

          const api = await this.apiService.getTextSpeech(message, voiceId);
          
          await ctx.sendAudio({ url: api.url, filename: `${voiceId}.mp3` }, {
               reply_markup: {
                    inline_keyboard: [
                         [{ text: 'Назад к выбору голоса', callback_data: '/voices' }],
                         [{ text: 'Выйти на главную', callback_data: `leave` }],
                    ],
               },
          });
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