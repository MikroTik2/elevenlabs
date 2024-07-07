import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import { ApiService } from "@/api/api.service";
import { CloudinaryModule } from "@/cloudinary/cloudinary.module";

@Module({

     imports: [
          HttpModule,
          CloudinaryModule,
     ],

     providers: [ApiService],
     exports: [ApiService],
})

export class ApiModule {};