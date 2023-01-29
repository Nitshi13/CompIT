/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendAvailableReports = async (ctx: any) => {
  const keyboard = [[Markup.button.callback(MESSAGES_AU.REPORT_NEW_USERS_BTN, 'reportNewUsers')]];

  await ctx.reply(`${MESSAGES_AU.CHECK_REPORT_DATA}`, Markup.inlineKeyboard(keyboard));
};
