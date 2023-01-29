/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const axios = require('axios');

import { IUser } from '../model/user.model';
import { getUser } from '../repository/getUser';

import { parseQueryParamsFromString } from '../utils/parseQueryParamsFromString';
import { uppercaseWords } from '../utils/uppercaseWords';
import { sendAdminNotificationAddUserToSeminar } from '../utils/sendAdminNotificationAddUserToSeminar';

import MESSAGES_AU from '../translate/messagesUA.json';

export const addUserToSeminar = async (actionFromButton: string = '', ctx: any): Promise<any> => {
  await ctx.reply(`${MESSAGES_AU.LOADER}`);
  const chatId: number = ctx?.update?.callback_query?.from?.id;

  const userData: null | IUser = await getUser({ chatId }, ctx);

  if (!userData) {
    return await ctx.reply(`${MESSAGES_AU.ERROR_DB_REQUEST}`);
  }

  const { firstName, lastName, phone, position } = userData;
  const fullName: string = firstName + ' ' + lastName;
  const formattedFullName = uppercaseWords(fullName);

  const { date, time } = parseQueryParamsFromString(actionFromButton);

  try {
    const { status } = await axios.post(`${process.env.PELART_SEMINARS_BASE_URL}`, {
      userData: [date, time, formattedFullName, phone, position],
    });

    if (status !== 200) {
      return await ctx.reply(`${MESSAGES_AU.ERROR_ADD_USER_TO_SEMINAR}`);
    }

    await ctx.reply(`${MESSAGES_AU.SUCCESS_REGISTER_USER_TO_SEMINAR}`);

    // Send notification to admins about new user
    return await sendAdminNotificationAddUserToSeminar({
      ctx,
      date,
      time,
      fullName: formattedFullName,
      phone,
      position,
    });
  } catch (error) {
    console.log('[error]', error);
    return await ctx.reply(`${MESSAGES_AU.ERROR_ADD_USER_TO_SEMINAR}`);
  }
};
