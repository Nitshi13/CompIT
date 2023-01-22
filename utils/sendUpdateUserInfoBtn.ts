/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendUpdateUserInfoBtn = async (ctx: any) => {
  const keyboard = [[Markup.button.callback('Оновити свій профіль', 'updateUserInfo')]];

  return await ctx.reply(`${MESSAGES_AU.UPDATE_USER_POSITION}`, Markup.inlineKeyboard(keyboard));
};
