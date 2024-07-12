import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';

import { catchError, firstValueFrom, map } from 'rxjs';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class ApiService {
     constructor(
          private readonly configService: ConfigService,
          private readonly cloudinaryService: CloudinaryService,
          private readonly httpService: HttpService,
     ) {};

     private api_key = this.configService.get<string>('ELEVENLABS_API_KEY');

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
                    "xi-api-key": this.api_key,
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
                    'xi-api-key': this.api_key,
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
                    "xi-api-key": this.api_key,
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
          const form = new FormData();

          const formHeaders = form.getHeaders();
          const audioResponse = await firstValueFrom(
               this.httpService.get<ArrayBuffer>(file, { responseType: 'arraybuffer' }),
          );

          const buffer = Buffer.from(audioResponse.data);
          form.append('audio', buffer, { filename: 'audio.mp3', contentType: 'audio/mpeg' });

          const options = {
               method: 'POST',
               url: `https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}/stream`,
               headers: {
                    ...formHeaders,
                    'xi-api-key': this.api_key,
               },
               
               data: form,
          };

          const response = await this.httpService.request({...options, responseType: 'arraybuffer'}).pipe(
               map(response => response.data),
               catchError(error => {
                    throw new Error(`Failed to get audio from ElevenLabs: ${error.message}`);
               }),
          ).toPromise();

          const audio = await this.cloudinaryService.uploadAudio(`data:audio/mp3;base64,${response.toString('base64')}`);

          return audio;
     };

     // ---------------- Audio Isolation Stream ----------------

     /**
      * Performs audio isolation on a given video or audio file using the ElevenLabs API.
      *
      * @param format - The format of the input file. Must be either 'audio' or 'video'.
      * @param file - The URL or local path of the input file.
      * @returns A Promise that resolves to the uploaded audio URL from Cloudinary.
      * @throws Will throw an error if the request fails or if the API key is invalid.
      *
      * @example
      * ```typescript
      * const isolatedAudioUrl = await apiService.getIsolationVideoOrAudio('audio', 'https://example.com/audio.mp3');
      * console.log(isolatedAudioUrl);
      * ```
     */
     async getIsolationVideoOrAudio(format: string, file: string) {
          const form = new FormData();

          let uploadFile: any;

          if (format === 'audio') {
               uploadFile = await this.cloudinaryService.uploadAudio(file);
          };

          if (format === 'video') {
               uploadFile = await this.cloudinaryService.uploadVideo(file);
          };

          const formHeaders = form.getHeaders();
          const audioResponse = await firstValueFrom(
               this.httpService.get<ArrayBuffer>(uploadFile.url, { responseType: 'arraybuffer' }),
          );
          
          const buffer = Buffer.from(audioResponse.data);
          form.append('audio', buffer, { filename: 'audio.mp3', contentType: 'audio/mpeg' });

          const options = {
               method: 'POST', 
               url: 'https://api.elevenlabs.io/v1/audio-isolation/stream',
               headers: {
                    'xi-api-key': this.api_key,
                    ...formHeaders,
               },

               data: form,
          };

          const response = await this.httpService.request({...options, responseType: 'arraybuffer'}).pipe(
               map(response => response.data),
               catchError(error => {
                    throw new Error(`Failed to get audio from ElevenLabs: ${error.message}`);
               }),
          ).toPromise();

          const audio = await this.cloudinaryService.uploadAudio(`data:audio/mp3;base64,${response.toString('base64')}`);

          return audio;;
     };
};