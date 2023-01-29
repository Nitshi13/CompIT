/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { bot } from '../config/telegram.config';

import { IUser } from '../model/user.model';
import { getUsers } from '../repository/getUsers';

import { USER_ROLES } from '../constants/userRoles';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendAdminNotificationAddUserToSeminar = async (data) => {
  const { ctx, date, time, fullName, phone, position } = data;

  const admins: [] | Array<IUser> = (await getUsers({ userRole: USER_ROLES.ADMIN }, ctx)) || [];
  const isAdmins: boolean = !!admins.length;

  if (!isAdmins) {
    return;
  }

  let messageToSend = `${MESSAGES_AU.MSG_TO_ADMIN_NEW_SEMINAR_USER}`;
  messageToSend += `\n${MESSAGES_AU.DATE} ${date}`;
  messageToSend += `\n${MESSAGES_AU.TIME} ${time}`;
  messageToSend += `\n${MESSAGES_AU.CLIENT_FULL_NAME} ${fullName}`;
  messageToSend += `\n${MESSAGES_AU.PHONE} ${phone}`;
  messageToSend += `\n${MESSAGES_AU.POSITION} ${position}`;

  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    try {
      await bot.telegram.sendMessage(chatId, messageToSend, {
        parse_mode: 'html',
      });
    } catch (error) {
      console.log('[error] ::: sendMessage', error.message);
    }
  }
};
