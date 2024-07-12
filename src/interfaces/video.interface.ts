export interface IVideo {
     duration: number,
     width: number,
     height: number,
     file_name: string,
     mime_type: string,
     thumbnail: {
          file_id: string,
          file_unique_id: string,
          file_size: number,
          width: number,
          height: number
     },
     thumb: {
          file_id: string,
          file_unique_id: string,
          file_size: number,
          width: number,
          height: number
     },
     file_id: string,
     file_unique_id: string,
     file_size: number
};