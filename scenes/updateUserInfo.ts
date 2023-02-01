/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');

import { POSITIONS } from '../constants/positions';
import { IUser } from '../model/user.model';
import { getUser } from '../repository/getUser';
import { updateUser } from '../repository/updateUser';
import { sendAdminNotificationUpdateUserData } from '../utils/sendAdminNotificationUpdateUserData';

import MESSAGES_AU from '../translate/messagesUA.json';

export const updateUserInfo = new Scenes.WizardScene(
  'updateUserInfo',
  async (ctx: any): Promise<any> => {
    const keyboard = [
      [Markup.button.callback(POSITIONS.COSMETOLOGIST, POSITIONS.COSMETOLOGIST)],
      [Markup.button.callback(POSITIONS.DERMATOLOGIST, POSITIONS.DERMATOLOGIST)],
      [Markup.button.callback(POSITIONS.MASSEUR, POSITIONS.MASSEUR)],
      [Markup.button.callback(POSITIONS.CLINIC, POSITIONS.CLINIC)],
      [Markup.button.callback(POSITIONS.PERSON, POSITIONS.PERSON)],
    ];

    await ctx.reply(`${MESSAGES_AU.LIST_OF_POSITIONS}`, Markup.inlineKeyboard(keyboard));
    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const userPosition: string = ctx?.update?.callback_query?.data;
    const chatId: number = ctx?.update?.callback_query?.from?.id;

    // Validate user position
    if (!userPosition) {
      ctx.reply(MESSAGES_AU.ERROR_USER_POSITION, {
        parse_mode: 'html',
      });
      return;
    }

    await ctx.reply(MESSAGES_AU.LOADER, { parse_mode: 'html' });

    const { position } = await getUser({ chatId }, ctx);

    // If user set PERSON position again
    if (position === userPosition) {
      await ctx.reply(MESSAGES_AU.ERROR_THE_SAME_DATA, { parse_mode: 'html' });

      return ctx.scene.leave();
    }

    const updatedUserData: null | IUser = await updateUser({ chatId }, { position: userPosition }, ctx);

    if (!updatedUserData) {
      await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });

      return ctx.scene.leave();
    }

    await ctx.reply(MESSAGES_AU.SUCCESS_UPDATE_USER_DATA, { parse_mode: 'html' });

    // Send notification to admins about users's new data
    await sendAdminNotificationUpdateUserData(updatedUserData, ctx);

    return ctx.scene.leave();
  },
);
