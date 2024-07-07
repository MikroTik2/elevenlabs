import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudinaryService {
     constructor(private readonly configService: ConfigService) {
          cloudinary.config({
               cloud_name: this.configService.get<string>('CLOUDINARY_API_NAME'),
               api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
               api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
          });
     };

     private readonly options_audio = {
          folder: 'audio',
          resource_type: "video",
     };

     private readonly options_video = {
          folder: 'video',
          resource_type: "video",
     };

     private async uploadFile(file: string, options: object): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               return await cloudinary.uploader.upload(file, options);
          } catch (err) {
               throw new BadRequestException(`Failed to upload file from Cloudinary: ${err.message}`);
          };
     };

     async uploadAudio(file: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.uploadFile(file, this.options_audio);
     };

     async uploadVideo(file: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.uploadFile(file, this.options_video);
     };
};