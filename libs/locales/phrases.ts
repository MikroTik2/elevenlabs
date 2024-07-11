export const phrases = {
     home(name: string) {
          return `👋 Привет - <b>${name}</b>! Я бот, который может конвертировать текст в речь с использованием продвинутой AI модели. Введи текст, и я озвучу его для тебя.`
     },
     help: "⁉️<b> Если у тебя есть проблемы.</b> \n✉️ <b>Напишите мне</b> <a href='https://t.me/d16ddd348'>@d16ddd348</a><b>.</b>",
     load: "<code>Сообщение принял. Жду ответа от сервера!</code>",
     error: "<b>⁉️Упсс ошибка ты ничего не выбрал</b>",
     alert_leave: 'Вы вернулись в главное меню',
     leave: `
<b>Вы можете использовать следующие команды:</b> 

/start - начать использование бота, 
/help - написать про ошибку, 
/voices - выбрать голос для преобразования текста в аудио,  
     `,
     voices: {
          item_voice_1: "<b>Теперь выбирите голос</b>:",
          item_voice_2: "Отправьте <b>текст</b> или <b>аудио</b>, которое хотите озвучить",
          item_voice_3(api: any) {
               return `Имя: <code>${api.name}</code>, \nКатегория: <code>${api.category}</code>, \nАкцент: <code>${api.labels.accent}</code>, \nПол: <code>${api.labels.gender}</code>, \nВозраст: <code>${api.category}</code>,`
          },
     },
} as const;