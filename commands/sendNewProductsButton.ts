/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2021-2022> <Yurii Andriiko>
 * http://yurets.info/
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { URLS } from '../constants/urls';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendNewProductsButton = async (ctx: any): Promise<any> => {
  const keyboard = [
    [
      {
        text: MESSAGES_AU.NEW_PRODUCTS_BTN_TITLE,
        url: URLS.NEW_PRODUCTS,
      },
    ],
  ];

  return await ctx.reply(`${MESSAGES_AU.NEW_PRODUCTS_PARAGRAPH}`, Markup.inlineKeyboard(keyboard));
};
