/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { bot } from '../config/telegram.config';

import { IUser } from '../model/user.model';
import { getUser } from '../repository/getUser';
import { updateUser } from '../repository/updateUser';
import { getUsers } from '../repository/getUsers';

import { uppercaseWords } from './uppercaseWords';

import { USER_ROLES } from '../constants/userRoles';

import MESSAGES_AU from '../translate/messagesUA.json';

export const deactivateUserProfile = async (data: string, ctx: any) => {
  const userId = data.replace('deactivate_user_id=', '');

  const admins: [] | Array<IUser> = (await getUsers({ userRole: USER_ROLES.ADMIN }, ctx)) || [];
  const userData: null | IUser = await getUser({ _id: userId }, ctx);

  if (!userData) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(chatId, MESSAGES_AU.ERROR_USER_TO_ACTIVATE_DOES_NOT_EXIST, {
          parse_mode: 'html',
        });
      } catch (error) {
        console.log('[error] ::: sendMessage => deactivateUserProfile', error.message);
      }
    }

    return;
  }

  const { _id, chatId, firstName, lastName, isActive } = userData;

  // If user profile is alreary not active
  if (!isActive) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(
          chatId,
          `${uppercaseWords(firstName)} ${uppercaseWords(lastName)} \n\n${
            MESSAGES_AU.ERROR_USER_PROFILE_ALREADY_DEACTIVATE
          }`,
          {
            parse_mode: 'html',
          },
        );
      } catch (error) {
        console.log('[error] ::: sendMessage => deactivateUserProfile', error.message);
      }
    }

    return;
  }

  const updatedUserData = await updateUser({ _id: userId }, { isActive: false }, ctx);

  if (!updatedUserData) {
    for (let i = 0; i < admins.length; i++) {
      const { chatId } = admins[i];

      try {
        await bot.telegram.sendMessage(chatId, MESSAGES_AU.ERROR_USER_PROFILE_DEACTIVATE, {
          parse_mode: 'html',
        });
      } catch (error) {
        console.log('[error] ::: sendMessage => deactivateUserProfile', error.message);
      }
    }

    return;
  }

  // Send notification to user
  try {
    await bot.telegram.sendMessage(chatId, `${uppercaseWords(firstName)}, ${MESSAGES_AU.DEACTIVATED_MESSAGE_TO_USER}`, {
      parse_mode: 'html',
    });
  } catch (error) {
    console.log('[error] ::: sendMessage', error.message);
  }

  // Send notification to all admins
  for (let i = 0; i < admins.length; i++) {
    const { chatId } = admins[i];

    try {
      await bot.telegram.sendMessage(
        chatId,
        `${uppercaseWords(firstName)} ${uppercaseWords(lastName)} \n\n${MESSAGES_AU.SUCCESS_DEACTIVATE_USER_PROFILE}`,
        {
          parse_mode: 'html',
        },
      );
    } catch (error) {
      console.log('[error] ::: sendMessage => deactivateUserProfile', error.message);
    }
  }
};
