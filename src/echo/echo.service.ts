import { IContext } from '@/interfaces/context.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EchoService {

     constructor() {};

     async sendMessage(ctx: IContext): Promise<void> {
          
     };

     async sendAudio(ctx: IContext): Promise<void> {

     };

     async sendVideo(ctx: IContext): Promise<void> {

     };

     async saveImage(ctx: IContext): Promise<void> {

     };
     
     async replyOrEdit(ctx: IContext): Promise<void> {

     };

     async replyOrEditWithPhoto(ctx: IContext): Promise<void> {

     };

     async typedInlineKeyboard(): Promise<void> {

     };

     async typedKeyboard(): Promise<void> {

     };

     async simpleInlineKeyboard(): Promise<void> {

     };

     async simpleKeyboard(): Promise<void> {

     };

     async combineKeyboard(): Promise<void> {

     };
};