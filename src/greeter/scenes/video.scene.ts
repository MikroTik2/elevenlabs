import { Scene, SceneEnter, On, Ctx, Message } from 'nestjs-telegraf';
import { EchoService } from '@/echo/echo.service';
import { ApiService } from '@/api/api.service';

import { phrases } from 'libs/locales/phrases';
import { buttons } from 'libs/locales/buttons';

import { IContext } from '@/interfaces/context.interface';
import { IAudio } from '@/interfaces/audio.interface';
import { IVideo } from '@/interfaces/video.interface';
import { IMessage } from '@/interfaces/message.interface';

@Scene('VIDEO_SCENE_ID')
export class VideoScene {

     constructor(
          private readonly apiService: ApiService,
          private readonly echoService: EchoService,
     ) {};

     @SceneEnter()
     async onSceneEnter(@Ctx() ctx: IContext) {
          await this.echoService.replyVideo({
               video: 'http://res.cloudinary.com/dn7gjjo2z/video/upload/v1720755015/video/ssstwitter.com_1720055453394_ziuyua.mp4',
               text: '🤖 Please send me the <b>video</b> for processing to remove noise from your video.',
          }, ctx);
     };

     @On('audio')
     async onVoice(@Ctx() ctx: IContext, @Message('audio') video: IAudio) {
          const getFile = await ctx.telegram.getFileLink(video.file_id);
     
          await this.echoService.replyOrEdit({ text: phrases.load }, ctx);
          const api = await this.apiService.getIsolationVideoOrAudio('audio', getFile.href);

          await this.echoService.replyAudio({
               text: '@SkuffVoiceBot',
               audio: api.secure_url,
               filename: api.public_id,
               ...this.echoService.createTypedInlineKeyboard([
                    [{ text: buttons.leave, callback_data: '/start' }],
               ]),
          }, ctx);
     };

     @On('video')
     async onVideo(@Ctx() ctx: IContext, @Message('video') video: IVideo) {
          const getFile = await ctx.telegram.getFileLink(video.file_id);
     
          await this.echoService.replyOrEdit({ text: phrases.load }, ctx);
          const api = await this.apiService.getIsolationVideoOrAudio('video', getFile.href);

          await this.echoService.replyAudio({
               text: '@SkuffVoiceBot',
               audio: api.secure_url,
               filename: api.public_id,
               ...this.echoService.createTypedInlineKeyboard([
                    [{ text: buttons.leave, callback_data: '/start' }],
               ]),
          }, ctx);
     };

     @On('text')
     async onTextCommand(@Ctx() ctx: IContext, @Message() message: IMessage) {

          if (/^\/[a-zA-Z0-9]+$/.test(message.text)) {
               await ctx.scene.enter('HOME_SCENE_ID');
               return;
          };

          await this.echoService.replyOrEdit({ text: '⚠️ Please send a video for noise removal, not text.' }, ctx);
     };
}; 