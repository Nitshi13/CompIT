/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { bot } from '../config/telegram.config';

import { updateUser } from '../repository/updateUser';
import { getUsers } from '../repository/getUsers';

import { uppercaseWords } from '../utils/uppercaseWords';

import { USER_ROLES } from '../constants/userRoles';

import MESSAGES_AU from '../translate/messagesUA.json';

export const activateUserProfile = async (data: string, ctx: any) => {
  const userId = data.replace('activate_user_id=', '');

  const admins = (await getUsers({ userRole: USER_ROLES.ADMIN }, ctx)) || [];
  const updatedUserData = await updateUser({ _id: userId }, { isActive: true }, ctx);

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

  const { chatId, firstName, isActive } = updatedUserData;

  if (isActive) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(chatId, MESSAGES_AU.ERROR_USER_PROFILE_ALREADY_ACTIVATE, {
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

  // TODO: Send notification to all admins
};
