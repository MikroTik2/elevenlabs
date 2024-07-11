import { catchError, map } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import * as fs from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';
import * as FormData from 'form-data';

@Injectable()
export class ApiService {
     constructor(
          private readonly configService: ConfigService,
          private readonly cloudinaryService: CloudinaryService,
          private readonly httpService: HttpService,
     ) {};

     private async streamToBuffer(stream: stream.Readable): Promise<Buffer> {
          const chunks: Buffer[] = [];
          return new Promise((resolve, reject) => {
               stream.on('data', (chunk) => chunks.push(chunk));
               stream.on('end', () => resolve(Buffer.concat(chunks)));
               stream.on('error', reject);
          });
     };

     // ---------------- Text to Speech ----------------

     /**
      * Converts text to speech using the ElevenLabs API.
      *
      * @param text - The text to convert to speech.
      * @param id - The voice id to use for the speech synthesis.
      * @returns A Promise that resolves to the uploaded audio URL from Cloudinary.
      * @throws Will throw an error if the request fails or if the API key is invalid.
      *
      * @example
      * ```typescript
      * const textToSpeechId = 'en_US_Michael';
      * const speechText = 'Hello, world!';
      * const audioUrl = await apiService.getTextSpeech(speechText, textToSpeechId);
      * console.log(audioUrl);
      * ```
     */
     async getTextSpeech(text: string, voiceId: string) {
          const options = {
               method: 'POST',
               url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
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

     /**
      * Retrieves the voice details for a specific voice id from ElevenLabs API.
      *
      * @param id - The voice id to retrieve details for.
      * @returns A Promise that resolves to the voice details object.
      * @throws Will throw an error if the request fails or if the API key is invalid.
      *
      * @example
      * ```typescript
      * const voiceId = 'en_US_Michael';
      * const voiceDetails = await apiService.getVoiceId(voiceId);
      * console.log(voiceDetails);
      * ```
      */
     async getVoiceId(voiceId: string) {

          const options = {
               method: 'GET',
               url: `https://api.elevenlabs.io/v1/voices/${voiceId}`,
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

     /**
      * Retrieves a list of available voices from the ElevenLabs API.
      *
      * @returns A Promise that resolves to an array of voice objects.
      * @throws Will throw an error if the request fails or if the API key is invalid.
      *
      * @example
      * ```typescript
      * const voices = await apiService.getVoices();
      * console.log(voices);
      * ```
     */
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
          ).toPromise();

          return response;
     };

     // ---------------- Speech to Speech ----------------

     /**
      * Converts speech to speech using the ElevenLabs API.
      *
      * @param file - The URL or local path of the audio file to convert.
      * @param voiceId - The voice id to use for the speech synthesis.
      * @returns A Promise that resolves to the uploaded audio URL from Cloudinary.
      * @throws Will throw an error if the request fails or if the API key is invalid.
      *
      * @example
      * ```typescript
      * const speechToSpeechId = 'en_US_Michael';
      * const speechFile = 'https://example.com/audio.ogg';
      * const convertedAudioUrl = await apiService.getSpeechToSpeech(speechFile, speechToSpeechId);
      * console.log(convertedAudioUrl);
      * ```
     */
     async getSpeechToSpeechStream(file: string, voiceId: string): Promise<any> {
          const audioBuffer = await firstValueFrom(
               this.httpService.get(file, { responseType: 'arraybuffer' }),
          );
      
          const headers = {
               "Content-Type": 'application/json',
               'xi-api-key': this.configService.get<string>('ELEVENLABS_API_KEY'),
          };
      
          const data = {
               model_id: 'eleven_multilingual_v2',
               voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.0,
                    use_speaker_boost: true,
               },
          };
      
          const formData = new FormData();

          formData.append('audio', audioBuffer.data, {
               filename: 'input.oga',
               contentType: 'audio/ogg',
          });

          formData.append('data', JSON.stringify(data));
      
          const formHeaders = formData.getHeaders();
          const response = await this.httpService.post(`https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}/stream`, formData, {
               headers: {
                    ...headers,
                    ...formHeaders,
               },
               responseType: 'stream',
          }).toPromise();
      
          const responseBuffer = await this.streamToBuffer(response.data);
          const voice = await this.cloudinaryService.uploadAudio(`data:audio/mp3;base64,${responseBuffer.toString('base64')}`);

          return voice;
     };
};