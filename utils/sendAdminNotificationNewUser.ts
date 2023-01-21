/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { bot } from '../config/telegram.config';

import { getUsers } from '../repository/getUsers';

import { USER_ROLES } from '../constants/userRoles';
import { POSITIONS } from '../constants/positions';

import { uppercaseWords } from '../utils/uppercaseWords';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendAdminNotificationNewUser = async (userData, ctx) => {
  const { firstName, lastName, phone, position } = userData;

  const admins = await getUsers({ userRole: USER_ROLES.ADMIN }, ctx);
  const isAdmins = !!admins.length;

  if (!isAdmins) {
    return;
  }

  const messageToSend = `${MESSAGES_AU.NOTIS_NEW_USER} \n${MESSAGES_AU.FIRST_NAME} ${uppercaseWords(firstName)} \n${
    MESSAGES_AU.LAST_NAME
  } ${uppercaseWords(lastName)} \n${MESSAGES_AU.PHONE} ${phone} \n${MESSAGES_AU.POSITION} ${position}`;

  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    if (position === POSITIONS.PERSON) {
      await bot.telegram.sendMessage(chatId, messageToSend, {
        parse_mode: 'html',
      });
    }
  }
};
