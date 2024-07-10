import { IReplyOrEditOptions } from '@/interfaces/replies/reply-or-edit.options';

export interface IReplyOrEditWithAudioOptions extends IReplyOrEditOptions {
    audio: string;
    filename: string;
};