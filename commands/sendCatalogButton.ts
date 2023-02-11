/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { URLS } from '../constants/urls';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendCatalogButton = async (ctx: any): Promise<any> => {
  const keyboard = [
    [
      {
        text: MESSAGES_AU.CATALOG_BTN_TITLE,
        url: URLS.CATALOG_URL,
      },
    ],
    [
      {
        text: MESSAGES_AU.INULA_LINE,
        url: URLS.PRODUCT_LINE_INULA,
      },
    ],
    [
      {
        text: MESSAGES_AU.APRICOT_LINE,
        url: URLS.PRODUCT_LINE_APRICOT,
      },
    ],
    [
      {
        text: MESSAGES_AU.DE_LYS_BLANC_LINE,
        url: URLS.PRODUCT_LINE_DE_LYS_BLANC,
      },
    ],
    [
      {
        text: MESSAGES_AU.TRIFOLIUM_PRETENSE_LINE,
        url: URLS.PRODUCT_LINE_TRIFOLIUM_PRETENSE,
      },
    ],
    [
      {
        text: MESSAGES_AU.LANA_BLUR_LINE,
        url: URLS.PRODUCT_LINE_LANA_BLUR,
      },
    ],
    [
      {
        text: MESSAGES_AU.SMART_BIOLOGICA_COMPELEXES,
        url: URLS.PRODUCT_LINE_SMART_BIOLOGICA_COMPELEXES,
      },
    ],
    [
      {
        text: MESSAGES_AU.VEGETABLE_LINE,
        url: URLS.PRODUCT_LINE_VEGETABLE,
      },
    ],
    [
      {
        text: MESSAGES_AU.FRUIT_LINE,
        url: URLS.PRODUCT_LINE_FRUIT,
      },
    ],
    [
      {
        text: MESSAGES_AU.BODY_LINE,
        url: URLS.PRODUCT_LINE_BODY,
      },
    ],
    [
      {
        text: MESSAGES_AU.PRO_PEELS_LINE,
        url: URLS.PRODUCT_LINE_PRO_PEELS,
      },
    ],
    [
      {
        text: MESSAGES_AU.APPARAT_LINE,
        url: URLS.PRODUCT_LINE_APPARAT,
      },
    ],
    [
      {
        text: MESSAGES_AU.ALMASK_LINE,
        url: URLS.PRODUCT_LINE_ALMASK,
      },
    ],
    [
      {
        text: MESSAGES_AU.RE_CELL_LINE,
        url: URLS.PRODUCT_LINE_RE_CELL,
      },
    ],
    [
      {
        text: MESSAGES_AU.MEZO_LINE,
        url: URLS.PRODUCT_LINE_MEZO,
      },
    ],
  ];

  return await ctx.reply(`${MESSAGES_AU.CATALOG_PARAGRAPH}`, Markup.inlineKeyboard(keyboard));
};
