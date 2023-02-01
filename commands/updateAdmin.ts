/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { getUser } from '../repository/getUser';
import { updateUser } from '../repository/updateUser';

import { USER_ROLES } from '../constants/userRoles';
import MESSAGES_AU from '../translate/messagesUA.json';

export const updateAdmin = async (ctx: any) => {
  const userCommand: string = ctx.update.message.text;
  const neededCommand: string = `update_admin_${process.env['ADMIN_SECRET_KEY']}`;
  const isMatch: boolean = userCommand === neededCommand;

  if (!isMatch) {
    return await ctx.reply(MESSAGES_AU.ERROR_SET_ADMIN, { parse_mode: 'html' });
  }

  const chatId: number = ctx.update.message.from.id;

  const userData = await getUser({ chatId }, ctx);

  if (!userData) {
    return await ctx.reply(MESSAGES_AU.ERROR_USER_NOT_EXIST, { parse_mode: 'html' });
  }

  const { userRole } = userData;

  if (userRole !== USER_ROLES.ADMIN) {
    return await ctx.reply(MESSAGES_AU.ERROR_USER_NOT_ADMIN, { parse_mode: 'html' });
  }

  await updateUser({ chatId }, { userRole: USER_ROLES.USER }, ctx);

  return await ctx.reply(MESSAGES_AU.UPD_ADMIN_STATUS, { parse_mode: 'html' });
};
