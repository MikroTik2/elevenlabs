import { Module } from '@nestjs/common';
import { EchoService } from '@/echo/echo.service';
import { GetAllVoices } from '@/greeter/scenes/voice';
import { ApiModule } from '@/api/api.module';

@Module({
    imports: [ApiModule],
    providers: [EchoService, GetAllVoices],
    exports: [EchoService]
})

export class EchoModule {};