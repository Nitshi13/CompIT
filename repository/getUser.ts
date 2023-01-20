/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { UserModel, IUser } from '../model/user.model';

import MESSAGES_AU from '../translate/messagesUA.json';

export const getUser = async (user: { chatId?: number }, ctx: any): Promise<IUser> => {
  let userData: null | IUser = null;

  try {
    userData = await UserModel.findOne(user);
  } catch (error) {
    console.log('[error => getUser] :::', error.message);
    await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });
  }

  return userData;
};
