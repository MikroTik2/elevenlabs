import { IReplyOrEditOptions } from '@/interfaces/replies/reply-or-edit.options';

export interface IReplyOrEditWithPhotoOptions extends IReplyOrEditOptions {
    image: string;
};