import { catchError, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class ApiService {
     constructor(
          private readonly configService: ConfigService,
          private readonly cloudinaryService: CloudinaryService,
          private readonly httpService: HttpService,
     ) {};

     async getTextSpeech(text: string, id: string) {
          const options = {
               method: 'POST',
               url: `https://api.elevenlabs.io/v1/text-to-speech/${id}`,
               headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": this.configService.get<string>('ELEVENLABS_API_KEY'),
               },

               data: {
                    text: text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                         stability: 0.5,
                         similarity_boost: 0.5,
                    },
               },
          };

          const response = await this.httpService.request({
               ...options,
               responseType: 'arraybuffer',
          }).pipe(
               map(response => response.data),
               catchError(error => {
                    throw new Error(`Failed to get audio from ElevenLabs: ${error.message}`);
               }),
          ).toPromise();

          const audioBuffer = Buffer.from(response);
          const audio = await this.cloudinaryService.uploadAudio(`data:audio/mp3;base64,${audioBuffer.toString('base64')}`);

          return audio;
     };

     async getVoiceId(id: string) {

          const options = {
               method: 'GET',
               url: `https://api.elevenlabs.io/v1/voices/${id}`,
               headers: {
                    'xi-api-key': this.configService.get<string>('ELEVENLABS_API_KEY'),
               },
          };

          const response = await this.httpService.request(options).pipe(
               map(response => response.data),
               catchError(error => {
                    throw new Error(`Failed to get voice id from ElevenLabs: ${error.message}`);
               }),
          ).toPromise();;

          return response;
     };

     async getVoices() {

          const options = {
               method: 'GET',
               url: 'https://api.elevenlabs.io/v1/voices',
               headers: {
                    "xi-api-key": this.configService.get<string>('ELEVENLABS_API_KEY'),
               },
          };

          const response = await this.httpService.request(options).pipe(
               map(response => response.data),
               catchError(error => {
                    throw new Error(`Failed to get voices from ElevenLabs: ${error.message}`);
               }),
          ).toPromise();;

          return response;
     };
};