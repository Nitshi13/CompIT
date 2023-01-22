/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { bot } from '../config/telegram.config';

import { IUser } from '../model/user.model';
import { getUsers } from '../repository/getUsers';

import { USER_ROLES } from '../constants/userRoles';

import { uppercaseWords } from './uppercaseWords';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendAdminNotificationUpdateUserData = async (userData, ctx) => {
  const { firstName, lastName, phone, position, isActive } = userData;

  const admins: [] | Array<IUser> = (await getUsers({ userRole: USER_ROLES.ADMIN }, ctx)) || [];
  const isAdmins: boolean = !!admins.length;

  if (!isAdmins) {
    return;
  }

  let messageToSend = `${MESSAGES_AU.NOTIF_TO_ADMIN_USER_UPDATE_DATA} \n${MESSAGES_AU.FIRST_NAME} ${uppercaseWords(
    firstName,
  )} \n${MESSAGES_AU.LAST_NAME} ${uppercaseWords(lastName)} \n${MESSAGES_AU.PHONE} ${phone} \n${
    MESSAGES_AU.POSITION
  } ${position} \n${MESSAGES_AU.PROFILE_IS_ACTIVE} ${isActive ? 'ТАК' : 'НІ'}`;

  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    // Send message contains user's data
    try {
      await bot.telegram.sendMessage(chatId, messageToSend, {
        parse_mode: 'html',
      });
    } catch (error) {
      console.log('[error] ::: sendMessage', error.message);
    }
  }
};
