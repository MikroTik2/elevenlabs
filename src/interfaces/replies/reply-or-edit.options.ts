import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export interface IReplyOrEditOptions {
     text?: string;
     args?: any;
     reply_markup?: InlineKeyboardMarkup;
};