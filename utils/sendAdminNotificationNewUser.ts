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
  const { firstName, lastName, phone, position, certificate, isActive } = userData;

  const admins = await getUsers({ userRole: USER_ROLES.ADMIN }, ctx);
  const isAdmins = !!admins.length;

  if (!isAdmins) {
    return;
  }

  let messageToSend = `${MESSAGES_AU.NOTIS_NEW_USER} \n${MESSAGES_AU.FIRST_NAME} ${uppercaseWords(firstName)} \n${
    MESSAGES_AU.LAST_NAME
  } ${uppercaseWords(lastName)} \n${MESSAGES_AU.PHONE} ${phone} \n${MESSAGES_AU.POSITION} ${position}`;

  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    if (position === POSITIONS.PERSON) {
      await bot.telegram.sendMessage(chatId, messageToSend, {
        parse_mode: 'html',
      });
    } else {
      if (!certificate) {
        messageToSend += `\n${MESSAGES_AU.CERTIFICATE_DOES_NOT_EXIST}`;
      }

      messageToSend += `\n${MESSAGES_AU.PROFILE_IS_ACTIVE} ${isActive ? 'ТАК' : 'НІ'}`;

      try {
        await bot.telegram.sendMessage(chatId, messageToSend, {
          parse_mode: 'html',
        });
      } catch (error) {
        console.log('[error] ::: sendMessage', error.message);
      }

      if (certificate) {
        const { telegramFileId } = certificate;

        try {
          await bot.telegram.sendPhoto(chatId, telegramFileId, { caption: `${firstName}` });
        } catch (error) {
          console.log('[error] ::: sendPhoto', error.message);
        }
      }
    }

    // TODO: Add Button to activate user profile
  }
};
