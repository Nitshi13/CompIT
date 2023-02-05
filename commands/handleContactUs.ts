/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { IUser } from '../model/user.model';
import { getUser } from '../repository/getUser';

import MESSAGES_AU from '../translate/messagesUA.json';

export const handleContactUs = async (ctx: any) => {
  const chatId = ctx?.update?.message?.from?.id;
  let userData: null | IUser = null;

  try {
    userData = await getUser({ chatId }, ctx);
  } catch (error) {
    console.log('[error]', error.message);
  }

  if (userData) {
    const keyboard = [[Markup.button.callback(MESSAGES_AU.CONTACT_BTN_TITLE, 'contactAdmin')]];

    return await ctx.reply(`${MESSAGES_AU.CONTACT_PRESS_BTN}`, Markup.inlineKeyboard(keyboard));
  }

  return await ctx.reply(`${MESSAGES_AU.CONTACT_US_PARAGRAPH}`);
};
