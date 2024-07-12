import { Scene, SceneEnter, On, Action, Ctx, Message } from 'nestjs-telegraf';
import { EchoService } from '@/echo/echo.service';
import { ApiService } from '@/api/api.service';

import { phrases } from 'libs/locales/phrases';
import { buttons } from 'libs/locales/buttons';

import { IAudio } from '@/interfaces/audio.interface';
import { IMessage } from '@/interfaces/message.interface';
import { IContext } from '@/interfaces/context.interface';

@Scene('VOICE_SCENE_ID')
export class VoiceScene {

     constructor(
          private readonly apiService: ApiService,
          private readonly echoService: EchoService,
     ) {};

     @SceneEnter()
     async onSceneEnter(@Ctx() ctx: IContext) {
          const api = await this.apiService.getVoices();

          const inlineKeyboard = api.voices.map((voice: any) => [({
               text: voice.name,
               callback_data: voice.voice_id.toString(),
          })]);

          await this.echoService.replyOrEdit({
               text: phrases.voices.item_voice_1,
               ...this.echoService.createTypedInlineKeyboard(inlineKeyboard, { columns: 4 })
          }, ctx);
     };

     @Action(/^[a-zA-Z0-9]{20}$/)
     async onVoiceCommand(@Ctx() ctx: IContext) {
          const id = ctx.callbackQuery?.['data']
          const api = await this.apiService.getVoiceId(id);

          let text = phrases.voices.item_voice_3(api)

          await this.echoService.replyAudio({
               audio: api.preview_url,
               filename: api.name,
               text: text,
               ...this.echoService.createTypedInlineKeyboard([
                    [{ text: buttons.write_text, callback_data: `text_speech_${api.voice_id}` }],
                    [{ text: buttons.leave, callback_data: `/start` }],
               ], { columns: 1 }),

          }, ctx);
     };

     @Action(/text_speech_(.+)/)
     async onTextSpeech(@Ctx() ctx: IContext) {
          const voiceId = ctx?.['match'];
          ctx.session.__scenes.state = {'voiceId': voiceId[1]}

          await this.echoService.replyOrEdit({ text: phrases.voices.item_voice_2 }, ctx);
     };

     @On('text')
     async onText(@Ctx() ctx: IContext, @Message() message: IMessage) {

          if (/^\/[a-zA-Z0-9]+$/.test(message.text)) {
               
               await ctx.scene.enter('HOME_SCENE_ID');
               return;
          };

          const voiceId = ctx.session.__scenes.state?.['voiceId']; 

          if (voiceId === undefined) {
               await this.echoService.replyOrEdit({ text: phrases.error }, ctx);
               return;
          };

          await this.echoService.replyOrEdit({ text: phrases.load }, ctx);
          const api = await this.apiService.getTextSpeech(message.text, voiceId);
 
          await this.echoService.replyAudio({
               audio: api.secure_url,
               filename: `${voiceId}.mp3`,
               ...this.echoService.createTypedInlineKeyboard(
                    [{ text: buttons.leave, callback_data: '/start' }], { columns: 1 },
               ),
               
          }, ctx);
     };

     @On('voice')
     async onVoice(@Ctx() ctx: IContext, @Message('voice') voice: IAudio) {

          const voiceId = ctx.session.__scenes.state?.['voiceId'];
          const file = await ctx.telegram.getFileLink(voice.file_id);
          
          await this.echoService.replyOrEdit({ text: phrases.load }, ctx);
          const api = await this.apiService.getSpeechToSpeechStream(file.href, voiceId);

          await this.echoService.replyAudio({
               audio: api.secure_url,
               filename: `${voiceId}.mp3`,
               ...this.echoService.createTypedInlineKeyboard(
                    [{ text: buttons.leave, callback_data: '/start' }], { columns: 1 },
               ),

          }, ctx);
     };
};