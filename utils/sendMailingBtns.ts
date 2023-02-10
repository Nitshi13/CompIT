/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendMailingBtns = async (ctx: any): Promise<any> => {
  const keyboard = [
    [
      Markup.button.callback(MESSAGES_AU.GENERAL_MAILING, 'createGeneralMailing'),
      Markup.button.callback(MESSAGES_AU.SEMINAR_MAILING, 'createSeminarMailing'),
    ],
  ];

  return ctx.reply(`${MESSAGES_AU.MAILING_TYPE}`, Markup.inlineKeyboard(keyboard));
};
