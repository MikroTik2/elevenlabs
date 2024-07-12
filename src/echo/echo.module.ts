import { Module } from '@nestjs/common';
import { EchoService } from '@/echo/echo.service';
import { ApiModule } from '@/api/api.module';

import { VoiceScene } from '@/greeter/scenes/voice.scene';
import { HomeScene } from '@/greeter/scenes/home.scene';
import { HelpScene } from '@/greeter/scenes/help.scene';
import { VideoScene } from '@/greeter/scenes/video.scene';

@Module({
    imports: [ApiModule],
    providers: [EchoService, VoiceScene, VideoScene, HomeScene, HelpScene],
    exports: [EchoService]
})

export class EchoModule {};