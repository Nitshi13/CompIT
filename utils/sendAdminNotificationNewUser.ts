/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { bot } from '../config/telegram.config';

import { getUsers } from '../repository/getUsers';

import { USER_ROLES } from '../constants/userRoles';
import { POSITIONS } from '../constants/positions';

import { uppercaseWords } from '../utils/uppercaseWords';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendAdminNotificationNewUser = async (userData, ctx) => {
  const { _id, firstName, lastName, phone, position, certificate, isActive } = userData;

  const admins = await getUsers({ userRole: USER_ROLES.ADMIN }, ctx);
  const isAdmins = !!admins.length;

  if (!isAdmins) {
    return;
  }

  let keyboard = null;

  let messageToSend = `${MESSAGES_AU.NOTIS_NEW_USER} \n${MESSAGES_AU.FIRST_NAME} ${uppercaseWords(firstName)} \n${
    MESSAGES_AU.LAST_NAME
  } ${uppercaseWords(lastName)} \n${MESSAGES_AU.PHONE} ${phone} \n${MESSAGES_AU.POSITION} ${position}`;

  if (position !== POSITIONS.PERSON) {
    if (!certificate) {
      messageToSend += `\n${MESSAGES_AU.CERTIFICATE_DOES_NOT_EXIST}`;
    }

    messageToSend += `\n${MESSAGES_AU.PROFILE_IS_ACTIVE} ${isActive ? 'ТАК' : 'НІ'}`;

    keyboard = [[Markup.button.callback(`Активувати ${firstName}`, `activate_user_id=${_id}`)]];
  }

  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    if (position === POSITIONS.PERSON) {
      // Send message contains user's data
      await bot.telegram.sendMessage(chatId, messageToSend, {
        parse_mode: 'html',
      });
    } else {
      // Send message contains user's data
      try {
        await bot.telegram.sendMessage(chatId, messageToSend, {
          parse_mode: 'html',
        });
      } catch (error) {
        console.log('[error] ::: sendMessage', error.message);
      }

      // Send user's uploaded file (photo)
      if (certificate) {
        const { telegramFileId } = certificate;

        try {
          await bot.telegram.sendPhoto(chatId, telegramFileId, { caption: `${firstName} ${lastName}` });
        } catch (error) {
          console.log('[error] ::: sendPhoto', error.message);
        }
      }

      // Send button for activating user's profile in DB
      try {
        await bot.telegram.sendMessage(chatId, `${MESSAGES_AU.ACTIVATE_USER_PROFILE}`, Markup.inlineKeyboard(keyboard));
      } catch (error) {
        console.log('[error] ::: sendPhoto', error.message);
      }
    }
  }
};
