export interface IMessage {
     message_id: number,
     from: {
          id: number,
          is_bot: boolean,
          first_name: string,
          username: string,
          language_code: string
     },
     chat: {
          id: 1946206772,
          first_name: string,
          username: string,
          type: string
     },
     date: 1720753717,
     text: string,
};