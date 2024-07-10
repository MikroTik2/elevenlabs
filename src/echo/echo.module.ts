import { Module } from '@nestjs/common';
import { EchoService } from '@/echo/echo.service';
import { GetAllVoices } from '@/greeter/scenes/voice';
import { GetAllVideo } from '@/greeter/scenes/video';
import { GreeterWizard } from '@/greeter/wizard/greeter.wizard';
import { ApiModule } from '@/api/api.module';

@Module({
    imports: [ApiModule],
    providers: [EchoService, GreeterWizard, GetAllVideo, GetAllVoices],
    exports: [EchoService]
})

export class EchoModule {};