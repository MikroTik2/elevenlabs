import { Module } from '@nestjs/common';
import { EchoUpdate } from '@/echo/echo.update';
import { EchoService } from '@/echo/echo.service';
import { GetAllVoices } from '@/greeter/scenes/voice';
import { GreeterModule } from '@/greeter/greeter.module';
import { GreeterUpdate } from '@/greeter/greeter.update';
import { ApiModule } from '@/api/api.module';

@Module({
    imports: [GreeterModule, ApiModule],
    providers: [EchoUpdate, GreeterUpdate, EchoService, GetAllVoices],
})
export class EchoModule {};