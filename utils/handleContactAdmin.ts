/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { IUser } from '../model/user.model';
import { getUser } from '../repository/getUser';
import { getUsers } from '../repository/getUsers';

import { uppercaseWords } from './uppercaseWords';

import { bot } from '../config/telegram.config';

import MESSAGES_AU from '../translate/messagesUA.json';
import { USER_ROLES } from '../constants/userRoles';

export const handleContactAdmin = async (ctx: any): Promise<any> => {
  const chatId = ctx?.update?.callback_query?.from?.id;
  let userData: null | IUser = null;

  try {
    userData = await getUser({ chatId }, ctx);
  } catch (error) {
    console.log('[error]', error.message);

    await ctx.reply(`${MESSAGES_AU.ERROR_DB_REQUEST_CONTACT_US}`);
    return await ctx.reply(`${MESSAGES_AU.CONTACT_US_PARAGRAPH}`);
  }

  if (!userData) {
    await ctx.reply(`${MESSAGES_AU.ERROR_DB_REQUEST_CONTACT_US}`);
    return await ctx.reply(`${MESSAGES_AU.CONTACT_US_PARAGRAPH}`);
  }

  const { firstName, lastName, phone, position, isActive } = userData;

  let messageToAdmin = `${MESSAGES_AU.NOTIF_TO_ADMIN_CONTACT} \n${MESSAGES_AU.CLIENT_FULL_NAME} \n`;
  messageToAdmin += `\n${MESSAGES_AU.FIRST_NAME} ${uppercaseWords(firstName)}`;
  messageToAdmin += `\n${MESSAGES_AU.LAST_NAME} ${uppercaseWords(lastName)}`;
  messageToAdmin += `\n${MESSAGES_AU.PHONE} ${phone}`;
  messageToAdmin += `\n${MESSAGES_AU.POSITION} ${position}`;
  messageToAdmin += `\n${MESSAGES_AU.PROFILE_IS_ACTIVE} ${isActive ? 'ТАК' : 'НІ'}`;

  const admins: [] | Array<IUser> = (await getUsers({ userRole: USER_ROLES.ADMIN }, ctx)) || [];

  const isAdmins: boolean = !!admins.length;

  if (!isAdmins) {
    // If there are no admins we just send message to user contains manager contact
    return await ctx.reply(`${MESSAGES_AU.CONTACT_US_PARAGRAPH}`);
  }

  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    // Send message contains user's data
    try {
      await bot.telegram.sendMessage(chatId, messageToAdmin, {
        parse_mode: 'html',
      });
    } catch (error) {
      console.log('[error] ::: sendMessage', error.message);
    }
  }

  // Send notification to user
  await ctx.reply(`${MESSAGES_AU.SEND_FEEDBACK_TO_CLIENT}`);
  return await ctx.reply(`${MESSAGES_AU.CONTACT_US_PARAGRAPH}`);
};
