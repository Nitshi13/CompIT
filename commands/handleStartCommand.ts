/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { IMessages } from '../interfaces/IMessage';
import { IUser } from '../model/user.model';

import { sendRegisterBtn } from '../utils/sendRegisterBtn';
import { handleDelayedSendMessage } from '../utils/handleDelayedSendMessage';

import { getUser } from '../repository/getUser';

import { uppercaseWords } from '../utils/uppercaseWords';

import { USER_ROLES } from '../constants/userRoles';

export const handleStartCommand = async (options: { ctx: any; messagesUA: IMessages }): Promise<any> => {
  const { ctx, messagesUA } = options;
  const chatId: number = ctx.chat.id;
  const { first_name } = ctx.from;

  // Look for the same User in DB
  const userData: null | IUser = await getUser({ chatId }, ctx);

  // New User actions
  if (!userData) {
    await ctx.reply(`${first_name}, ${messagesUA.START_MESSAGE_1_NEW_USER}`);

    await handleDelayedSendMessage({
      delayValue: 1000,
      ctx,
      message: `${messagesUA.START_MESSAGE_2_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 3000,
      ctx,
      message: `${messagesUA.START_MESSAGE_3_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 7000,
      ctx,
      message: `${messagesUA.START_MESSAGE_4_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 10000,
      ctx,
      message: `${messagesUA.START_MESSAGE_5_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 5000,
      ctx,
      action: sendRegisterBtn,
    });

    return;
  }

  // Handlers for exist users
  const { firstName, userRole } = userData;

  if (userRole === USER_ROLES.USER) {
    return await ctx.reply(`${uppercaseWords(firstName)}, ${messagesUA.START_MESSAGE_EXIST_USER}`);
  }

  const keyboard = [
    [
      Markup.button.callback(messagesUA.ADMIN_MAILING_BTN_TITLE, 'createMailing'),
      Markup.button.callback(messagesUA.ADMIN_REPORTS_BTN_TITLE, 'getAllReports'),
    ],
  ];

  return await ctx.reply(`${messagesUA.ADMIN_AVAILABLE_REPORTS}`, Markup.inlineKeyboard(keyboard));
};
