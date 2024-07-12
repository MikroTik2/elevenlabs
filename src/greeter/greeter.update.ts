import { Command, Ctx, Help, Start, Update, Action } from 'nestjs-telegraf';
import { UseFilters } from '@nestjs/common';

import { TelegrafExceptionFilter } from '@/common/filters/telegraf-exception.filter';
import { IContext } from '@/interfaces/context.interface';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class GreeterUpdate {

     @Start()
     @Action('/start')
     async onStart(@Ctx() ctx: IContext) {
          await ctx.scene.enter('HOME_SCENE_ID');
     };

     @Help()
     @Action('/help')
     async onHelp(@Ctx() ctx: IContext) {
          await ctx.scene.enter('HELP_SCENE_ID');
     };

     @Command('voices')
     @Action('/voices')
     async onSceneVoice(@Ctx() ctx: IContext): Promise<void> {
          await ctx.scene.enter('VOICE_SCENE_ID');
     };

     @Command('video')
     @Action('/video')
     async onSceneVideo(@Ctx() ctx: IContext): Promise<void> {
          await ctx.scene.enter('VIDEO_SCENE_ID');
     };
};