import { IReplyOrEditWithPhotoOptions } from '@/interfaces/replies/reply-or-edit-with-photo.options';
import { IReplyOrEditWithAudioOptions } from '@/interfaces/replies/reply-or-edit-with-audio.options';
import { Buttons, CallbackButton, Key, Keyboard, MakeOptions } from 'telegram-keyboard';
import { IButton } from '@/interfaces/button.interface';
import { IReplyAlertOptions } from '@/interfaces/replies/reply-alert';
import { IReplyOrEditOptions } from '@/interfaces/replies/reply-or-edit.options';
import { IContext } from '@/interfaces/context.interface';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Injectable } from '@nestjs/common';
import { Input } from 'telegraf';

@Injectable()
export class EchoService {

     constructor() {};

     async sendMessage(options: IReplyOrEditOptions, ctx: IContext,) {

          const { reply_markup, text } = options;

          return await ctx.sendMessage(text, { 
               parse_mode: 'HTML',
               reply_markup,
               ...reply_markup,
          }) as Message.TextMessage;
     };

     async replyAudio(options: IReplyOrEditWithAudioOptions, ctx: IContext) {
          const { reply_markup } = options;

          return await ctx.sendAudio({ url: options.audio, filename: options.filename, }, {
               caption: options.text,
               parse_mode: 'HTML',
               reply_markup,
               ...reply_markup,
          }) as Message.AudioMessage;
     };

     async replyPhoto(ctx: IContext, options: IReplyOrEditWithPhotoOptions) {
          const { reply_markup } = options;

          return await ctx.sendPhoto(Input.fromURLStream(options.image), {
               caption: options.text,
               parse_mode: 'HTML',
               reply_markup,
               ...reply_markup,
          }) as Message.PhotoMessage;
     };

     async replyAlert(ctx: IContext, options: IReplyAlertOptions) {
          return await ctx.answerCbQuery(options.text);
     };

     createTypedInlineKeyboard(buttons: Buttons, makeOptions?: Partial<MakeOptions>) {
          return this.createTypedKeyboard(buttons, makeOptions).inline();
     };

     createTypedKeyboard(buttons: Buttons, makeOptions?: Partial<MakeOptions>) {
          const parsedButtons: any = this.toTypedKeyboard(buttons);
          if (parsedButtons) {
               return Keyboard.make(parsedButtons, makeOptions);
          };

          return Keyboard.make([], makeOptions);
     };

     createSimpleInlineKeyboard(buttons: Buttons, makeOptions?: Partial<MakeOptions>) {
          return this.createSimpleKeyboard(buttons, makeOptions).inline();
     };
      
     createSimpleKeyboard(buttons: Buttons, makeOptions?: Partial<MakeOptions>) {
          return Keyboard.make(buttons, makeOptions);
     };

     combineKeyboards(...keyboards: Keyboard[]) {
          return Keyboard.combine(...keyboards);
     };
      
     removeKeyboard() {
          return Keyboard.remove();
     };

     private factoryCallbackData(buttons: Buttons, template?: string) {
          return buttons.map((button: any) => {
               if (typeof button === 'string') {
                    return Key.callback(button, template ? template + button : button);
               };

               if (Array.isArray(button)) {
                    return button.map((btn) => Key.callback(btn, template ? template + btn : btn));
               };
               
          }) as CallbackButton[];
     };

     private toTypedKeyboard(buttons: Buttons, makeOptions?: MakeOptions) {
          return buttons.flatMap((btn: any | IButton | (string | IButton)[]) => {
               if (typeof btn === 'string') {
                    return this.toCallbackButton({ text: btn });
               };
         
               if (Array.isArray(btn)) {
                    return btn.map((button) => this.toCallbackButton(typeof button === 'string' ? { text: button } : button));
               };
         
               return this.toCallbackButton(btn);
          });
     };

     private toCallbackButton(button: IButton): CallbackButton {
          return {
               text: button.text,
               callback_data: button.callback_data || button.text,
               hide: button.hide || false,
          };
     };
};