/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import MESSAGES_AU from '../translate/messagesUA.json';
import { USER_ROLES } from '../constants/userRoles';

import { getUser } from '../repository/getUser';
import { updateUser } from '../repository/updateUser';

import { handleDelayedSendMessage } from '../utils/handleDelayedSendMessage';
import { sendRegisterBtn } from '../utils/sendRegisterBtn';

export const setAdmin = async (ctx: any): Promise<any> => {
  const userCommand: string = ctx.update.message.text;
  const neededCommand: string = `set_admin_${process.env['ADMIN_SECRET_KEY']}`;
  const isMatch: boolean = userCommand === neededCommand;

  if (!isMatch) {
    return await ctx.reply(MESSAGES_AU.ERROR_SET_ADMIN, { parse_mode: 'html' });
  }

  const chatId: number = ctx.update.message.from.id;

  const userData = await getUser({ chatId }, ctx);

  if (!userData) {
    await ctx.reply(MESSAGES_AU.ERROR_USER_NOT_EXIST, { parse_mode: 'html' });

    // Send register btn to start register scene
    return await handleDelayedSendMessage({
      delayValue: 2000,
      ctx,
      action: sendRegisterBtn,
    });
  }

  const { userRole } = userData;

  if (userRole === USER_ROLES.ADMIN) {
    return await ctx.reply(MESSAGES_AU.ERROR_USER_IS_ADMIN, { parse_mode: 'html' });
  }

  await updateUser({ chatId }, { userRole: USER_ROLES.ADMIN, isActive: true }, ctx);

  return await ctx.reply(MESSAGES_AU.UPD_ADMIN_SUCCES, { parse_mode: 'html' });
};
