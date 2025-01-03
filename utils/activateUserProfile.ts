/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');

import { bot } from '../config/telegram.config';

import { IUser } from '../model/user.model';
import { getUser } from '../repository/getUser';
import { updateUser } from '../repository/updateUser';
import { getUsers } from '../repository/getUsers';

import { uppercaseWords } from '../utils/uppercaseWords';

import { USER_ROLES } from '../constants/userRoles';

import MESSAGES_AU from '../translate/messagesUA.json';

export const activateUserProfile = async (data: string, ctx: any) => {
  const userId: string = data.replace('activate_user_id=', '');

  const userData: null | IUser = await getUser({ _id: userId }, ctx);
  const admins: Array<IUser> | [] = (await getUsers({ userRole: USER_ROLES.ADMIN }, ctx)) || [];

  if (!userData) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(chatId, MESSAGES_AU.ERROR_USER_TO_ACTIVATE_DOES_NOT_EXIST, {
          parse_mode: 'html',
        });
      } catch (error) {
        console.log('[error] ::: sendMessage => activateUserProfile', error.message);
      }
    }

    return;
  }

  const { _id, chatId, firstName, lastName, isActive } = userData;

  // If user profile already active return error message
  if (isActive) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(
          chatId,
          `${uppercaseWords(firstName)} ${uppercaseWords(lastName)} \n\n${
            MESSAGES_AU.ERROR_USER_PROFILE_ALREADY_ACTIVATE
          }`,
          {
            parse_mode: 'html',
          },
        );
      } catch (error) {
        console.log('[error] ::: sendMessage => activateUserProfile', error.message);
      }
    }

    return;
  }

  const updatedUserData: null | IUser = await updateUser({ _id: userId }, { isActive: true }, ctx);

  if (!updatedUserData) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(chatId, MESSAGES_AU.ERROR_USER_PROFILE_ACTIVATE, {
          parse_mode: 'html',
        });
      } catch (error) {
        console.log('[error] ::: sendMessage => activateUserProfile', error.message);
      }
    }

    return;
  }

  // Send notification to user
  try {
    await bot.telegram.sendMessage(chatId, `${uppercaseWords(firstName)}, ${MESSAGES_AU.ACTIVATED_MESSAGE_TO_USER}`, {
      parse_mode: 'html',
    });
  } catch (error) {
    console.log('[error] ::: sendMessage', error.message);
  }

  const keyboard = [[Markup.button.callback(`Деактивувати ${uppercaseWords(firstName)}`, `deactivate_user_id=${_id}`)]];

  // Send notification to all admins
  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    try {
      await bot.telegram.sendMessage(
        chatId,
        `${uppercaseWords(firstName)} ${uppercaseWords(lastName)} \n\n${MESSAGES_AU.SUCCESS_ACTIVATE_USER_PROFILE}`,
        {
          parse_mode: 'html',
        },
      );
    } catch (error) {
      console.log('[error] ::: sendMessage => activateUserProfile', error.message);
    }

    // Send button for activating user's profile in DB
    try {
      await bot.telegram.sendMessage(chatId, `${MESSAGES_AU.DEACTIVATE_USER_PROFILE}`, Markup.inlineKeyboard(keyboard));
    } catch (error) {
      console.log('[error] ::: sendPhoto => activateUserProfile', error.message);
    }
  }
};
