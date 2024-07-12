import { IReplyOrEditOptions } from '@/interfaces/replies/reply-or-edit.options';

export interface IReplyOrEditWithVideoOptions extends IReplyOrEditOptions {
    video: string;
};